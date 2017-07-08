module.exports = [
  {
    method: 'GET',
    path: '/relationshiptypes',
    handler: function (request, reply) {
      const RelationshipType = request.server.collections().relationshiptype;

      RelationshipType.find().exec(function(exec,types){
        reply.view('relationshiptype/relationshiptypes.hbs',{
          'relationshiptypes': types,
        });
      });

    },
  },
  {
    method: 'POST',
    path: '/relationshiptype/new',
    handler: function (request, reply){
      const RelationshipType = request.server.collections().relationshiptype;
      RelationshipType.create({
        name: request.payload.name,
        nameInverse: request.payload.nameInverse
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
      const RelationshipType = request.server.collections().relationshiptype;
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
