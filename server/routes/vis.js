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
      var viewParams = {};
      Promise.all([
        ArchComponent.find().then((results)=>{
          viewParams.components = results;
        }),
        ComponentRelation.find({inverse: false}).then((results) => {
          viewParams.relations = results;
        })
      ]).then(() => {
        reply.view('vis/visbase.hbs',viewParams);
      }).catch((err) =>{
        //TODO: Do something meaningful here
      })
    },
  },
]