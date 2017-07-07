module.exports = [
  {
    method: 'GET',
    path: '/componenttypes',
    handler: function (request, reply) {
      const ComponentType = request.server.collections().componenttype;

      ComponentType.find().exec(function(err,types){
        reply.view('componenttype/componenttypes.hbs',{
          'componenttypes': types,
        });
      });

    },
  },
  {
    method: 'POST',
    path: '/componenttype/new',
    handler: function (request, reply){
      const ComponentType = request.server.collections().componenttype;
      ComponentType.create({name: request.payload.name})
        .then(() => {
            reply.redirect('/componenttypes');
          })
          .catch((err) => {
              //TODO: Do something more meaningfull here
             console.error(err);
         });
    }
  },
  {
    method: 'GET',
    path: '/componenttype/{id}/delete',
    handler: function (request, reply){
      const ComponentType = request.server.collections().componenttype;
      //Prevent empty ID
      if (request.params.id) {
        ComponentType.destroy({id: request.params.id}).exec(function(err){
          Hoek.assert(!err, err);
        });
      } else {
        //TODO: Reply with some kind of error
      }
      reply.redirect('/componenttypes');

    }
  },
]
