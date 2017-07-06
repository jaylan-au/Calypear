const ArchComponent = require('../model/archcomponent');
const EntityManager = require('../persistence/entitymanager');

module.exports = [
  {
    method: 'GET',
    path: '/archcomponents',
    handler: function (request, reply) {
      //Fetch Required Data for the List
      var em = new EntityManager();
      var archcomponents =  em.db().get('archcomponents').value();

      //Fetch required data for the input form

      reply.view('archcomponents.hbs',{
        'archComponents': archcomponents,
        'componentTypes': em.getComponentTypes(),
      });
    },
  },
  {
    method: 'POST',
    path: '/archcomponent',
    handler: function (request, reply) {
      /**
        Convert Payload to a ArchComponent
        TODO: Find a better way to do this
     */
     var em = new EntityManager();
     var newComponent = new ArchComponent();
     newComponent.id = em.uuid();
     newComponent.name = request.payload.name;
     newComponent.componentType = request.payload.componentType;

     em.db().get('archcomponents').push(newComponent).write();
     if (request.payload.forwardToEdit) {
        reply.redirect('/archcomponent/'+newComponent.id);
     } else {
        reply.redirect('/archcomponents');
     }

    },
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}',
    handler: function (request, reply) {
      //fetch the requested component
      //load the lookup types

      reply('Archcomponents' + request.params.id);
    },
  },
  {
    method: 'GET',
    path: '/error',
    handler: {
      view: 'error'
    }
  }
];
