const Accepts = require('accepts');
module.exports = [
  {
    method: 'GET',
    path: '/tagtypes',
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
        .then(() => {
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
          reply.redirect('/tagtypes');
        }).catch((err) => {
          //TODO: Handle
        });
      } else {
        //TODO: Reply with some kind of error
      }


    }
  },
]
