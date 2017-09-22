const Accepts = require('accepts');
module.exports = [
  {
    method: 'GET',
    path: '/tagtypes',
    config: {
      tags: ['admin']
    },
    handler: function (request, reply) {
      const TagType = request.server.collections(true).tagtype;

      TagType.find().then(function(types){
        switch (Accepts(request.raw.req).type(['json','html'])) {
          case 'json':
            reply(types);
          break;

          default:
          reply.view('tagtype/tagtypes.hbs',{
            'tagtypes': types,
          });
        }
      }).catch(function(err){
        //TODO: Do something meaningfull here
      });

    },
  },
  {
    method: 'POST',
    path: '/tagtype/new',
    handler: function (request, reply){
      const TagType = request.server.collections(true).tagtype;
      TagType.create({
        name: request.payload.name,
        category: request.payload.category
      })
        .then((result) => {
          request.log(['schema-change','app'], {message: 'Tag Type Created', object: result});
            reply.redirect('/tagtypes');
          })
          .catch((err) => {
              //TODO: Do something more meaningfull here
             console.error(err);
         });
    }
  },
  {
    method: 'GET',
    path: '/tagtype/{id}/delete',
    handler: function (request, reply){
      const TagType = request.server.collections(true).tagtype;
      //Prevent empty ID
      if (request.params.id) {
        TagType.destroy({id: request.params.id}).then(() => {
          //all good
          request.log(['schema-change','app'], {message: 'Tag Type Deleted', object: request.params.id});
          reply.redirect('/tagtypes');
        }).catch((err) => {
          reply(err);
        });
      } else {
        //TODO: Reply with some kind of error
      }


    }
  },
]
