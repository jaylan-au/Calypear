//import d3 from 'd3';
import Axios from 'axios';

import DiagramComponent from './calypear-diagram-component.js';

export default class CalypearDiagram {
  constructor(options){
    this._components = [];
  }


  async fetchComponentData(componentId) {
    let filledComponent = await Promise.all([
      Axios.get('/arch-component/'.concat(componentId)).then((response) => {
        return response.data;
      }),
      Axios.get('/component-relation/component/'.concat(componentId)).then((response) => {
        return response.data;
      }),
      Axios.get('/component-tag/component/'.concat(componentId)).then((response) => {
        return response.data;
      }),
    ]).then((responses) => {
      let componentData = responses[0];
      componentData.relations = responses[1];
      componentData.tags = responses[2];
      return componentData;
    }).catch((err) => {
      throw new Error(err);
    });
    return filledComponent;
  }

  getComponentById(componentId) {
    return this._components.find((currItem) => {
      return currItem._id == componentId;
    });
  }

  hasComponentId(componentId) {
    let component = this.getComponentById(componentId);
    if (component) {
      return true;
    } else {
      return false;
    }
  }

  addComponentById(componentId){
    //TODO: If it already exists - don't add it
    //TODO: Consider updating it if it already exists
    if (!this.hasComponentId(componentId)) {
      return this.fetchComponentData(componentId).then((componentData) => {
        let addComponent = new DiagramComponent(componentData);
        this._components.push(addComponent);
        return this;
      }).catch((err) => {
        throw new Error(err);
      });
    } else {
      return Promise.resolve(this);
    }

  }

  addComponentsById(componentIds) {
    //co-oerve the parameter to an array
    let addPromiseList = [];
    componentIds = [].concat(componentIds);
    componentIds.forEach((currComponentId) => {
      addPromiseList.push(this.addComponentById(currComponentId));
    });

    return Promise.all(addPromiseList);
  }

  getRelatedComponentIds(componentId) {
    //Find the component -> and its relations
    let component = this.getComponentById(componentId);
    if (component) {
      //TODO: De-dup this
      return component.relations.map((currItem) => {
        return currItem.inverse?currItem.from:currItem.to;
      });
    } else {
      return null;
    }
  }

  addRelatedComponents(componentIds) {
    //Coerce to an array
    if (!Array.isArray(componentIds)) {
      componentIds = [componentIds];
    }

    let relatedComponentIds = [];

    componentIds.forEach((currComponentId) => {
      relatedComponentIds = relatedComponentIds.concat(
        this.getRelatedComponentIds(currComponentId)
      );
    })

    if (relatedComponentIds) {
      return this.addComponentsById(relatedComponentIds);
    } else {
      return null;
    }
  }

  get componentIds(){
    return this._components.map((currItem) => {
      return currItem._id;
    });
  }

  addAllRelatedComponents() {
    let currComponentIds = this.componentIds;
    this.addRelatedComponents(currComponentIds);
  }

  reloadComponents() {
    let currComponentIds = this.componentIds;
    this._components = [];
    this.addComponentsById(currComponentIds);
  }

  removeComponentById(componentId) {
    //Remove all instances of the component - should only be one but just in case
    this._components = this._components.filter((currComponent) => {
      return (currComponent._id != componentId)
    });
  }

  removeComponentsById(componentIds) {
    if (!Array.isArray(componentIds)) {
      componentIds = [componentIds];
    }

    componentIds.forEach((currComponentId) => {
      this.removeComponentById(currComponentId)
    });

    return Promise.resolve(componentIds);
  }

  get nodes() {
    return Array.from(this._components);
  }

  get links() {
    let activeComponentIds = this.componentIds;

    //TODO: Filter out inverse relations that don't have a partner if a direct relation exists
    let links =  this._components.reduce((accumulator, currentItem) => {
      return accumulator.concat(currentItem.relations);
    },[]);
    //Map source/target
    links.forEach((currLink) => {
      currLink.source = currLink.from;
      currLink.target = currLink.to;
    });

    //Filter out links to items that aren't in the workspace;
    //links.filter

    return links.filter((currLink) => {
      return activeComponentIds.includes(currLink.to);
    });
    //return [];
  }


}
