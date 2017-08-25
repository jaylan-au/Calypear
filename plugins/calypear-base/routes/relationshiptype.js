const Accepts = require('accepts');
module.exports = [
  {
    method: 'GET',
    path: '/relationshiptypes',
    config: {
      tags: ['admin']
    },
    handler: function (request, reply) {
      const RelationshipType = request.server.collections(true).relationshiptype;

      RelationshipType.find().exec(function(exec,types){
        switch (Accepts(request.raw.req).type(['json','html'])) {
          case 'json':
            reply(types);
          break;
          default:
          reply.view('relationshiptype/relationshiptypes.hbs',{
            'relationshiptypes': types,
          });
        }
      });

    },
  },
  {
    method: 'POST',
    path: '/relationshiptype/new',
    handler: function (request, reply){
      const RelationshipType = request.server.collections(true).relationshiptype;
      RelationshipType.create({
        name: request.payload.name,
        nameInverse: request.payload.nameInverse,
        distance: request.payload.distance
      })
        .then(() => {
            reply.redirect('/relationshiptypes');
          })
          .catch((err) => {
              //TODO: Do something more meaningfull here
             console.error(err);
         });
    }
  },
  {
    method: 'GET',
    path: '/relationshiptype/{id}/delete',
    handler: function (request, reply){
      const RelationshipType = request.server.collections(true).relationshiptype;
      //Prevent empty ID
      if (request.params.id) {
        RelationshipType.destroy({id: request.params.id}).then(() =>{
          reply.redirect('/relationshiptypes');
        }).catch((err) => {
          //TODO: Handle this
        });
      } else {
        //TODO: Reply with some kind of error
      }


    }
  },
]
