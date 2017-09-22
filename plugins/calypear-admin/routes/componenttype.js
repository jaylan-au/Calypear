const Accepts = require('accepts');
module.exports = [
  {
    method: 'GET',
    path: '/componenttypes',
    config: {
      tags: ['admin']
    },
    handler: function (request, reply) {
      const ComponentType = request.server.collections(true).componenttype;

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
    path: '/componenttype/{id}',
    handler: function (request, reply){
      const ComponentType = request.server.collections(true).componenttype;

      ComponentType.update({id:request.params.id},{
        name: request.payload.name,
        diagramIcon: request.payload.diagramIcon,
      }).then((result) => {
        request.log(['schema-change','app'], {message: 'Component Type Updated', object: result});
        reply.redirect('/componenttypes')
      });
    }
  },
  {
    method: 'POST',
    path: '/componenttype/new',
    handler: function (request, reply){
      const ComponentType = request.server.collections(true).componenttype;
      ComponentType.create({name: request.payload.name}).then((result) => {
            request.log(['schema-change','app'], {message: 'Component Type Created', object: result});
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
      const ComponentType = request.server.collections(true).componenttype;
      //Prevent empty ID
      if (request.params.id) {
        ComponentType.destroy({id: request.params.id}).then(() => {
          //all good
          request.log(['schema-change','app'], {message: 'Component Type Deleted', object: request.params.id});
          reply.redirect('/componenttypes');
        }).catch((err) => {
          reply(err);
        });
      } else {
        //TODO: Reply with some kind of error
      }


    }
  },
]
