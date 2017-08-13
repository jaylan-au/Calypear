class CalypearDiagramComponent {
  constructor(componentData,diagramComponentData = {}) {
    if (componentData != null) {
      if (componentData.id) {
        this.id = componentData.id;
      }

      if (componentData.name) {
        this.name = componentData.name;
      }

      if (componentData.type) {
        this.type = {};
        if (componentData.type.id) {
          this.type.id = componentData.type.id;
        }
        if (componentData.type.name) {
          this.type.name = componentData.type.name;
        }
      }

      this.relationships = componentData.relationships;
      //Set the Source/Target fields
      this.relationships.forEach(function(relationship) {
        relationship.source = relationship.from;
        relationship.target = relationship.to;
      });

    }

    if (diagramComponentData.includedInDiagram) {
      this.includedInDiagram = diagramComponentData.includedInDiagram;
    } else {
      this.includedInDiagram = false;
    }


    /**
      Set defaults for display
    */
    this.display = {
      //<=0: Automatic (Diagam specifics will determine this)
      //>0: Use the specific size
      width: 0,
      //-1 = Automatic/Use defaults
      //>-1 - Use the specified angle
      //0 = 3 O'Clock position and proceeds clockwise
      rotation: 0
    }

    if (diagramComponentData.display) {
      this.display.width = diagramComponentData.display.width;
      this.displau.rotation = diagramComponentData.display.rotation;
    }


    //Currently this effectively unpins the component
    //Waiting here until we are supplied with further Diagram Specifics for the component
    this.pinAt(componentData.fixedX, componentData.fixedY);
  }

  pinAtPosition(){
    this.pinAt(this.x, this.y);
  }

  /*
    Hold only sets the fixed position,
    This generally is to allow nodes to be stopped from exiting to view box
    while the simulation is running - without actually pinning them.
    Rather than simply ignoring X/Y movement which would cause the simulation
    issues.
  */
  holdAt(x,y){
    this.fx = x;
    this.fy = y;
  }

  pinAt(x,y){
    this.fx = x;
    this.fy = y;

    if (x || y) {
      this.pinned = true;
    } else {
      this.pinned = false;
    }
    return this;
  }

  pinRelease(){
    this.pinAt(null,null);
    return this;
  }

  isPinned(){
    //No longer relies on the Fx/Fy positions as they are set by the dragging
    //logic hence may or may not be set.
    return this.pinned;
  }

  included(includedInDiagram = true) {
    this.includedInDiagram = includedInDiagram
    return this;
  }

  isIncludedInDiagram() {
    return this.includedInDiagram;
  }

  getForwardRelationships() {
    return this.relationships.filter(function(relationship){
      return relationship.inverse == false
    });
  }

  getRelationships() {
    return this.relationships;
  }

  getRelatedComponentIds(forwardOnly = false, limitType = null){
    var forwardIds = this.relationships.map(function(relationship){
      return relationship.to;
    });
    if (!forwardOnly) {
      forwardIds.concat(this.relationships.map(function(relationship){
        return relationship.from;
      }));
    }
    return forwardIds;
  }

  getDiagramSaveObject(){
    var componentToSave = {
      component: this.id,
    }
    if (this.isPinned()) {
      componentToSave.fixedX = this.fx;
      componentToSave.fixedY = this.fy;
    }
    return componentToSave;
  }
}

class CalypearDiagram  {
  constructor() {
    this.diagramComponents = new Array();
    this.diagramName = 'Untitled';
  }

  name(name){
    if (name) {
      this.diagramName = name;
      return this;
    } else {
      return this.diagramName;
    }
  }

  nodeById(nodeId) {
    return this.diagramComponents.find(function(component){
      return component.id == nodeId;
    })
  }

  nodes() {
    return this.diagramComponents;
  }


  edges() {
    var edges = [];
    var componentIds = [];
    //Pull out the relationships for all the diagram components
    /**
      Note: The deep copy is to prevent the issue with removing items
      creating weird edges that don't connect to things
      Probably a much more effecient way to do this but will solve tht later
      TODO: Do this better
    */
    this.diagramComponents.forEach(function(component) {
      edges = edges.concat(component.getRelationships().map(function(relationship){
        return JSON.parse(JSON.stringify(relationship))
      }));
      // edges = edges.concat(component.getRelationships());
      componentIds.push(component.id);
    });
    //Filter out relationships to unknown objects
    edges = edges.filter(function(relationship,index,relationsArray) {
      return (componentIds.includes(relationship.to) && (componentIds.includes(relationship.from)));
    });
    //Filter out inverse Relationships when a forward relationship exists
    //TODO: this
    return edges;
  }

  getDiagramComponentIds(){
    return this.diagramComponents.map((component) => {
      return component.id;
    });
  }

  /*
    Will run the expand function on each component connected to the supplied
    component id, Flourishing null will be interpreted as ALL components

    Returns a promise for consistency
  */
  flourishAll(iterations = 1, refreshOnSuccess = true) {
    var  componentIdsToFlourish = this.getDiagramComponentIds();

    //Recursive flourish - warning - dangerous
    return this.retrieveAndAddRelatedComponents(componentIdsToFlourish).then(() => {
      if (iterations > 1) {
        //Recursion
        return diagram.flourishAll(iterations-1,refreshOnSuccess);
      } else {
        //Caller is expecting a Promise -
        return Promise.resolve("Retrieved");
      }
    },{diagram: this});
  }

  /*
    Removes all components that do not have atleast X links to other components
    Note: A forward and inverse link between objects count as 2,
          An object with a link to itself counts as linked
  */
  removeOrphanComponents(minimumLinks = 1, refreshOnSuccess = true) {
    //Get a list of all component id's in the diagram
    var diagramComponentIds = this.diagramComponents.reduce((accumulator,component) => {
      accumulator.push(component.id);
      return accumulator;
    },[])
    //Find the components that aren't linked to anything above
    var componentsToRemove = this.diagramComponents.reduce((accumulator, component) => {
      var thisComponentLinks = component.getRelationships().filter((relationship) => {
        return (diagramComponentIds.includes(relationship.to) && diagramComponentIds.includes(relationship.from));
      });
      if (thisComponentLinks < minimumLinks) {
        accumulator.push(component.id);
      }
      return accumulator;
    },[]);

    this.removeComponents(componentsToRemove,refreshOnSuccess);
  }

  removeComponents(componentIds, refreshOnSuccess = true) {
    //Force componentIds to be an array so we can process consistently
    if (!(componentIds instanceof Array)) {
      componentIds = [componentIds];
    }
    //Get a map of the element ids from the components Array
    var elementsToRemove = [] ;

    this.diagramComponents.forEach(function(element, index){
      if (componentIds.includes(element.id)) {
        elementsToRemove.push(index);
      }
    })

    //sort the elements to remove and reverse it so we work back from the end
    //of the array
    //otherwise deleting will alter the indexes
    elementsToRemove.sort().reverse();
    elementsToRemove.forEach(function(elemToRemove){
      this.diagramComponents.splice(elemToRemove,1);
    },this);

    if (refreshOnSuccess) {
      this.updateDiagram();
    }

  }

  retrieveAndAddComponents(componentIds, autoIncludeComponents = false, refreshOnSuccess = true){
    var queryParams =  {
      componentId: componentIds,
      detailed: true,
    }
    var url = '/archcomponents';
    var current = this;
    var returnPromise = new Promise(function(resolve, reject){
      $.ajax({
        dataType: "json",
        method: "GET",
        url: url,
        data: $.param(queryParams,true),
        context: {
          diagram: current,
          autoInclude: autoIncludeComponents
        },
        success: function(responseData) {
          var existingComponentIds = this.diagram.diagramComponents.map(function(ac){
            return ac.id;
          });
          if (responseData.archComponents) {
            responseData.archComponents.forEach(function(newComponent){
              //Check if the component already exists if so - ignore it
              //TODO: Delete and replace (in case relationships have changed on the server)
              if (!existingComponentIds.includes(newComponent.id)){
                var componentDiagramData = {
                  includedInDiagram: autoIncludeComponents
                }
                diagram.diagramComponents.push(new CalypearDiagramComponent(newComponent,componentDiagramData));
              }
            });
            resolve("Components Loaded");
          } else {
            reject("No component received");
          }
          if (refreshOnSuccess) {
            this.diagram.updateDiagram();
          }

        }
      });
    },this);
    return returnPromise;
  }

  retrieveAndAddRelatedComponents(componentIds, autoIncludeComponents = false, refreshOnSuccess = true) {
    //This could be done quicker and faster using a D3 nest but trying not to introduce depednancies here
    //Function accepts a single component or an array
    if (!(componentIds instanceof Array)) {
      componentIds = [componentIds];
    }
    //Get the components
    var componetsToExpand = [];
    componentIds.forEach((componentId) => {
      var thisComponent = this.nodeById(componentId);
      if (thisComponent) {
        componetsToExpand.push(thisComponent);
      }
    })
    //Get an array of related components
    var relatedComponentIds = componetsToExpand.reduce((accumulator,component) =>{

      return accumulator.concat(component.getRelatedComponentIds());
    },[]);
    //Remove duplicates here
    var relatedComponentIds = relatedComponentIds.filter((element, index, relatedComponentArray) => {
      return relatedComponentArray.indexOf(element) == index;
    });


    if (relatedComponentIds) {
      return this.retrieveAndAddComponents(relatedComponentIds,autoIncludeComponents,refreshOnSuccess);
    } else {
      return Promise.reject("Component not loaded");
    }

  }



  updateDiagram(){
    refresh(this.nodes(), this.edges());
  }

  getDiagramSaveObject(){
    var returnObj = {
      components: [],
      name: this.diagramName,
      id: this.id
    };
    this.diagramComponents.forEach(function(diagramComponent) {
      if (diagramComponent.includedInDiagram) {
        returnObj.components.push(diagramComponent.getDiagramSaveObject());
      }

    });

    return returnObj;
  }

  saveDiagramToServer(){
    var saveObject = {
      diagram: this.getDiagramSaveObject()
    }
    var url = "/diagram"
    return new Promise((resolve,reject) => {
      $.ajax({
        method: "POST",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        //processData: false,
        data: JSON.stringify(saveObject),
        url: url,
        context: {diagram: this},
        success: function(responseData) {
          //Set the ID so we can update the saved diagram
          diagram.id = responseData.diagram[0].id;
          resolve(diagram);
        },
        error: function(){
          reject("Error saving diagram");
        }
      });
    },this)

  }

  loadDiagramFromObject(diagramObject){
    this.name(diagramObject.name);
    this.id = diagramObject.id;
    this.diagramComponents = [];
    var componentIds = diagramObject.components.map(function(diagramComponent){
      return diagramComponent.component;
    });
    //TODO: Need to account for Fixed Position Components?
    //Retrieve the components from the server (this ensures we get all the data we want consistently)
    this.retrieveAndAddComponents(componentIds,true,true).then(() => {
    //   this.components
      diagramObject.components.forEach((requestedComponent) => {
        if ((requestedComponent.fixedX) || (requestedComponent.fixedY)) {
          console.log(requestedComponent);
          var activeComponent = this.nodeById(requestedComponent.component);
          console.log(activeComponent);
          if (activeComponent) {
            activeComponent.pinAt(requestedComponent.fixedX,requestedComponent.fixedY);
          }
        }
      });
    },this);
  }

  retrieveDiagramFromServer(diagramId){
    var url = "/diagram/"+diagramId;
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "GET",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        //processData: false,
        url : url,
        context: {diagram: this},
        success: function(responseData) {
          //Pick out the Diagram from the responseData
          if (responseData.diagram.length > 0)  {
            diagram.loadDiagramFromObject(responseData.diagram[0]);
          }
          resolve(this);
        },
        error: function(){
          reject("Error loading Diagram");
        }
      });
    },this);

  }

}
