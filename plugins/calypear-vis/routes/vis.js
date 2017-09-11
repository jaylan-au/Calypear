const Accepts = require('accepts');
const DiagramController = require('../controller/diagramcontroller');

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
    handler: DiagramController.deleteDiagram
  },
  {
    method: 'POST',
    path: '/diagram',
    handler: DiagramController.createDiagram
  },
  {
    method: 'POST',
    path: '/diagram/{id}',
    handler: DiagramController.updateDiagram
  }

]
