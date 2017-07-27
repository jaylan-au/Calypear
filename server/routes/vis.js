const Accepts = require('accepts');
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
      const ArchComponent = request.server.collections().archcomponent;
      const ComponentRelation = request.server.collections().componentrelation
      var viewParams = {
        layout: {
          fullwidth: true
        }
      };
      Promise.all([
        ArchComponent.find().populate(['type']).then((results)=>{
          viewParams.components = results;
        }),
        ComponentRelation.find({inverse: false}).populate(['type']).then((results) => {
          viewParams.relations = results;
        })
      ]).then(() => {
        reply.view('vis/visbase.hbs',viewParams);
      }).catch((err) =>{
        reply(err);
      })
    },
  },
  {
    method: 'GET',
    path: '/diagrams',
    handler: function(request, reply) {
      const Diagram = request.server.collections().diagram;

      Diagram.find().then((results) => {
        reply.view('vis/diagrams.hbs',{
          diagrams: results
        })
      }).catch((err) => {
        reply(err);
      });
    }
  },
  {
    method: 'GET',
    path: '/diagram/{id}',
    handler: function(request, reply) {
      //Design to retrieve the shell of a diagram only.
      //Subsequent calls are really required to get the details
      const Diagram = request.server.collections().diagram;
      const ArchComponent = request.server.collections().archcomponent;
      const ComponentRelation = request.server.collections().componentrelation;
      var viewParams = {}
      Promise.all([
        ArchComponent.find().populate(['type']).then((results)=>{
          viewParams.components = results;
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
      const Diagram = request.server.collections().diagram;
      const DiagramComponent = request.server.collections().diagram;
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
      const Diagram = request.server.collections().diagram;
      const DiagramComponent = request.server.collections().diagram;
      var payloadDiagram = request.payload.diagram;
      if (payloadDiagram.id) {
        //Updating Existing
        //Fetch the existing object first so we can compare
        Diagram.find(payloadDiagram.id).then((result) => {
          //Update main body
          //Update components
          reply({"action": "updating attempted"});
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
