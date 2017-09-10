const Accepts = require('accepts');
const DiagramController = require('../controller/diagramcontroler');

module.exports = [
  {
    method: 'GET',
    path: '/vis/data/archcomponent/{id}',
    handler: function(request, reply) {

    }
  },
  {
    method: 'GET',
    path: '/vis',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections(true).archcomponent;
      const RelationType = request.server.collections(true).relationshiptype;
      const ComponentType = request.server.collections(true).componenttype;
      var viewParams = {
        layout: {
          fullwidth: true
        }
      };
      Promise.all([
        //This stays for now as we need it for search - to be replacd by a proper search later
        ArchComponent.find().populate(['type']).then((results)=>{
          viewParams.components = results;
        }),
        RelationType.find().then((results) => {
          viewParams.relationTypes = results;
        }),
        ComponentType.find().then((results) => {
          viewParams.componentTypes = results;
        })
      ]).then(() => {
        if (request.query.componentId) {
          viewParams.componentId = request.query.componentId;
        }
        reply.view('vis/visbase.hbs',viewParams);
      }).catch((err) =>{
        reply(err);
      })
    },
  },
  {
    method: 'GET',
    path: '/diagrams',
    handler: DiagramController.searchDiagrams,
  },
  {
    method: 'GET',
    path: '/diagram/{id}',
    handler: function(request, reply) {
      //Design to retrieve the shell of a diagram only.
      //Subsequent calls are really required to get the details
      const Diagram = request.server.collections(true).diagram;
      const ArchComponent = request.server.collections(true).archcomponent;
      const RelationType = request.server.collections(true).relationshiptype;
      const ComponentRelation = request.server.collections(true).componentrelation;
      var viewParams = {
        layout: {
          fullwidth: true
        },
        diagramId: request.params.id
      }
      Promise.all([
        ArchComponent.find().populate(['type']).then((results)=>{
          viewParams.components = results;
        }),
        RelationType.find().then((results) => {
          viewParams.relationTypes = results;
        }),
        ComponentRelation.find({inverse: false}).populate(['type']).then((results) => {
          viewParams.relations = results;
        }),
        Diagram.find({id: request.params.id})
          .populate(['components'])
          .then((results) => {
          viewParams.diagram = results;
        })
      ]).then(() => {
        switch (Accepts(request.raw.req).type(['json','html'])) {
          case 'json':
            reply(viewParams);
          break;
          default:
            reply.view('vis/visbase.hbs',viewParams);
        }
      }).catch((err) => {
        reply(err);
      });
    }
  },
  {
    method: 'GET',
    path: '/diagram/{id}/delete',
    handler: function(request, reply) {
      const Diagram = request.server.collections(true).diagram;
      const DiagramComponent = request.server.collections(true).diagram;
      Promise.all([
        Diagram.destroy({id: request.params.id}),
        DiagramComponent.destroy({diagram: request.params.id})
      ]).then(() => {
        reply.redirect('/diagrams');
      }).catch((err) => {
        reply(err);
      });
    }
  },
  {
    method: 'POST',
    path: '/diagram',

    handler: function(request,reply) {
      const Diagram = request.server.collections(true).diagram;
      const DiagramComponent = request.server.collections(true).diagram;
      var payloadDiagram = request.payload.diagram;
      console.log(payloadDiagram);
      if (payloadDiagram.id) {
        //Updating Existing
        //Fetch the existing object first so we can compare
        Diagram.findOne({id: payloadDiagram.id}).populate(['components']).then((serverDiagram) => {
          //Update main body
          //Update components
          console.log(serverDiagram);
          console.log(serverDiagram.components);
          //Merge the components together
          serverDiagram.name = payloadDiagram.name;
          payloadDiagram.components.forEach((mergeComponent) => {
            //Find the component in the result
            var mergeTo = serverDiagram.components.find((serverDiagComponent) => {
              return serverDiagComponent.component == this.mergeId;
            },{mergeId: mergeComponent.component});

            if (mergeTo) {
              //Update the properties for MergeTO
              if (mergeComponent.fixedX) {
                mergeTo.fixedX = mergeComponent.fixedX;
              }

              if (mergeComponent.fixedY) {
                mergeTo.fixedY = mergeComponent.fixedY;
              }

            } else {
              //Add the item into the component list
              serverDiagram.components.add({
                component: mergeComponent.component,
                fixedX: mergeComponent.fixedX,
                fixedY: mergeComponent.fixedY
              })
            }

            //Need to remember to remove components we aren't merging
          });
          serverDiagram.save();
          //result.components.push()
          reply.redirect('/diagram/'+payloadDiagram.id);
        }).catch((err) => {
          reply(err);
        })



      } else {
        //New
        var newDiagram = {
          name: payloadDiagram.name,
          components: payloadDiagram.components
        }

        Diagram.create(newDiagram).then((createdObject) => {
          reply(createdObject);
        }).error((err)=>{
          reply(err);
        });
      }

    }


  }
]
