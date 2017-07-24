const Accepts = require('accepts');
module.exports = [
  {
    method: 'GET',
    path: '/componenttypes',
    handler: function (request, reply) {
      const ComponentType = request.server.collections().componenttype;

      ComponentType.find().then(function(types){
        switch (Accepts(request.raw.req).type(['json','html'])){
          case 'json':
            reply(types);
          break;
          default:
            reply.view('componenttype/componenttypes.hbs',{
              'componenttypes': types,
            });
        }
      }).catch(function(err){
        reply(err);
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
              reply(err);
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
