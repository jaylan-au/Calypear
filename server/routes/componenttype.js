module.exports = [
  {
    method: 'GET',
    path: '/componenttypes',
    handler: function (request, reply) {
      const ComponentType = request.server.collections().componenttype;

      ComponentType.find().then(function(types){
        reply.view('componenttype/componenttypes.hbs',{
          'componenttypes': types,
        });
      }).catch(function(err){
        //TODO: Do something meaningfull here
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
        ComponentType.destroy({id: request.params.id}).then(() => {
          //all good
          reply.redirect('/componenttypes');
        }).catch((err) => {
          //TODO: Handle
        });
      } else {
        //TODO: Reply with some kind of error
      }


    }
  },
]
