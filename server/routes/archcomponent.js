module.exports = [
  {
    method: 'GET',
    path: '/archcomponents',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      const ComponentType = request.server.collections().componenttype;
      var componentTypes = [];
      ComponentType.find().exec(function(err,types){
        componentTypes = types;
      });

      ArchComponent.find().populate('type').exec(function(err,archComponents){


        reply.view('archcomponent/archcomponents.hbs',{
          'archComponents': archComponents,
          'componentTypes': componentTypes,
        });
      });

    },
  },
  {
    method: 'POST',
    path: '/archcomponent',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      ArchComponent.create({
        name: request.payload.name,
        type: request.payload.typeId,
      })
        .then(() => {
            reply.redirect('/archcomponents');
          })
          .catch((err) => {
              //TODO: Do something more meaningfull here
             console.error(err);
         });
      },
  },
];
