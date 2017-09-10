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
  createDiagram: {},
  getDiagram: {},
  updateDiagram: {},
  deleteDiagram: {}
}
