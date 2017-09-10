module.exports = {
  searchDiagrams: function(request, reply) {
    const Diagram = request.server.collections(true).diagram;

    Diagram.find().then((results) => {
      reply.view('vis/diagrams.hbs',{
        diagrams: results
      })
    }).catch((err) => {
      reply(err);
    });
  },
  createDiagram: function(request, reply) {
    const Diagram = request.server.collections(true).diagram;
    const DiagramComponent = request.server.collections(true).diagram;
    var payloadDiagram = request.payload.diagram;
    var newDiagram = {
      name: payloadDiagram.name,
      components: payloadDiagram.components
    }

    Diagram.create(newDiagram).then((createdObject) => {
      reply(createdObject);
    }).error((err)=>{
      reply(err);
    });
  },
  getDiagram: function(request, reply) {
    //Design to retrieve the shell of a diagram only.
    //Subsequent calls are really required to get the details
    const Diagram = request.server.collections(true).diagram;
    var viewParams = {
      layout: {
        fullwidth: true
      },
      diagramId: request.params.id
    }
    Promise.all([
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
  },
  updateDiagram: {},
  deleteDiagram: function(request, reply) {
    //Delete a diagram and all of its links
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
}
