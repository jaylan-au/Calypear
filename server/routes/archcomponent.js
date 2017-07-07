const uuidv4 = require('uuid/v4');

module.exports = [
  {
    method: 'GET',
    path: '/archcomponents',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      const ComponentType = request.server.collections().componenttype;
      var componentTypes = [];
      var archComponents = [];

      Promise.all([
        ComponentType.find().then(function(types){
          componentTypes = types;
        }),
        ArchComponent.find().populate('type').then(function(elements) {
          archComponents = elements
        })
      ]).then(function(){
        reply.view('archcomponent/archcomponents.hbs',{
          'archComponents': archComponents,
          'componentTypes': componentTypes,
        });
      }).catch(function(err){
        //TODO: Do something meaningfull here
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
  {
    method: 'GET',
    path: '/archcomponent/{id}',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      const RelationshipType = request.server.collections().relationshiptype;
      const ComponentRelation = request.server.collections().componentrelation;
      const ComponentType = request.server.collections().componenttype;

      var relationTypes = [];
      var archComponents = [];
      var componentTypes = [];
      var componentRelations = [];
      var archComponent = null;
      Promise.all([
        RelationshipType.find().then(function(types){
          relationTypes = types;
        }),
        ArchComponent.find().then(function(components){
          archComponents = components;
        }),
        ComponentType.find().then(function(types){
          componentTypes = types;
        }),
        ComponentRelation.find({from: request.params.id}).populate(['from','to','type']).then(function(relations){
          componentRelations = relations;
        }),
        ArchComponent.findOne({id: request.params.id})
        .populate('type')
        .then(function(ac){
          archComponent = ac;
        })
      ]).then(function(){
        reply.view('archcomponent/archcomponent.hbs',{
          'archComponent': archComponent,
          'componentRelations': componentRelations,
          'allComponents': archComponents,
          'relationTypes': relationTypes,
          'componentTypes': componentTypes
        });
      }).catch(function(err){
        //TODO: Do somethign meaningfull here
      })
    },
  },
  {
    method: 'POST',
    path: '/archcomponent/{id}',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      ArchComponent.update({
        id: request.params.id
      },{
        name: request.payload.name,
        type: request.payload.typeId
      }
      )
      .then(() => {
        reply.redirect('/archcomponent/'+request.params.id);
      })
      .catch((err) => {
        //TODO: Do something more meaningfull here
        console.error(err);
      });
    },
  },
  {
    method: 'POST',
    path: '/archcomponent/{id}/relation',
    handler: function (request, reply) {
      const ComponentRelation = request.server.collections().componentrelation;
      var transactionId = uuidv4();

      //Create two RElations - one and inverse of the other but sharing a transactionId
      ComponentRelation.create([
        {
          from: request.payload.fromId,
          to: request.payload.toId,
          type: request.payload.relationTypeId,
          inverse: false,
          transaction: transactionId
        },
        {
          from: request.payload.toId,
          to: request.payload.fromId,
          type: request.payload.relationTypeId,
          inverse: true,
          transaction: transactionId
        }
      ]).then(() => {
        reply.redirect('/archcomponent/'+request.params.id);
      })
      .catch((err) => {
        //TODO: Do something more meaningfull here
        console.error(err);
      });
    },
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}/relation/{transactionId}/delete',
    handler: function (request, reply) {
      const ComponentRelation = request.server.collections().componentrelation;

      ComponentRelation.destroy({transaction: request.params.transactionId}).then(function(){
        reply.redirect('/archcomponent/'+request.params.id)
      }).catch(function(err){
        //TODO: Do somethign more meaningfull here
      });

    }
  },
  {
    method: 'GET',
    path: '/archcomponent/search/{namesearch}',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      ArchComponent.find({name: {'like': '%'+request.params.namesearch+'%'}}).then(function(ac){
        reply.view('archcomponent/jsonlookup',{
          'archComponents': ac
        },{
          layout: false
        })
      }).catch(function(err) {
          //TODO: Do somethign meaningfull here
      });
    }
  }
];
