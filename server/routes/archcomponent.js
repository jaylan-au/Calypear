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
        ArchComponent.find()
        .populate('type')
        .sort('name')
        .then(function(elements) {
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
    path: '/archcomponent/{id}/delete',
    handler: function(request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      const ComponentRelation = request.server.collections().componentrelation;

      Promise.all([
        ArchComponent.destroy({id : request.params.id}),
        ComponentRelation.destroy({from: request.params.id}),
        ComponentRelation.destroy({to: request.params.id})
      ]).then(()=>{
        reply.redirect('/archcomponents');
      }).catch((err)=>{
        //TODO: Something meaningfull here
      });

      ArchComponent.destroy({id : request.params.id}).then(()=>{
        reply.redirect('/archcomponents');
      }).catch((err)=>{
        //TODO: Something meaningfull here
      })
    }
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      const RelationshipType = request.server.collections().relationshiptype;
      const ComponentRelation = request.server.collections().componentrelation;
      const ComponentType = request.server.collections().componenttype;
      const ComponentTag = request.server.collections().componenttag;
      const TagType = request.server.collections().tagtype;

      var relationTypes = [];
      var archComponents = [];
      var componentTypes = [];
      var componentRelations = [];
      var archComponent = null;
      var viewParams = {};

      Promise.all([
        RelationshipType.find().sort('name').then(function(results){
          viewParams.relationTypes = results;
        }),
        ArchComponent.find().sort('name').then(function(results){
          viewParams.allComponents = results;
        }),
        ComponentType.find().sort('name').then(function(results){
          viewParams.componentTypes = results;
        }),
        ComponentRelation.find({from: request.params.id})
          .populate(['from','to','type'])
          .sort('inverse')
          .sort('type')
          .then(function(results){
          viewParams.componentRelations = results;
        }),
        TagType.find().sort('name').then((results) => {
          viewParams.tagTypes = results;
        }),
        ComponentTag.find({component: request.params.id})
          .populate('tag')
          .sort('tag')
          .then((results) => {
          viewParams.componentTags = results;
        }),
        ArchComponent.findOne({id: request.params.id})
        .populate('type')
        .then(function(results){
          viewParams.archComponent = results;
        })
      ]).then(function(){
        reply.view('archcomponent/archcomponent.hbs',viewParams);
        // reply.view('archcomponent/archcomponent.hbs',{
        //   'archComponent': archComponent,
        //   'componentRelations': componentRelations,
        //   'allComponents': archComponents,
        //   'relationTypes': relationTypes,
        //   'componentTypes': componentTypes
        // });
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
        type: request.payload.typeId,
        description: request.payload.description,
        alternativeNames: request.payload.alternativeNames,
        docUrl: request.payload.docUrl
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
    path: '/archcomponent/{id}/tag',
    handler: function (request, reply) {
      const ComponentTag = request.server.collections().componenttag;

      ComponentTag.create({
        component: request.params.id,
        tag: request.payload.tagTypeId,
        value: request.payload.value
      }).then(() => {
        reply.redirect('/archcomponent/'+request.params.id);
      }).catch((err) => {
        reply(err);
      });
    }
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}/tag/{tagId}/delete',
    handler: function (request, reply) {
      const ComponentTag = request.server.collections().componenttag;

      ComponentTag.destroy({id: request.params.tagId}).then(() => {
        reply.redirect('/archcomponent/'+request.params.id);
      }).catch((err) => {
        reply(err);
      });
    }
  },
  {
    method: 'POST',
    path: '/archcomponent/{id}/relation',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      const ComponentRelation = request.server.collections().componentrelation;
      var transactionId = uuidv4();
      var relationComponentId = null;

      if (!request.payload.toId) {
          //First create the object - then build the relation.
          ArchComponent.create({
            name: request.payload.componentName,
            type: request.payload.compoenntTypeId
          }).then((component)=> {
            ComponentRelation.create([
              {
                from: request.payload.fromId,
                to: component.id,
                type: request.payload.relationTypeId,
                inverse: false,
                transaction: transactionId
              },
              {
                from: component.id,
                to: request.payload.fromId,
                type: request.payload.relationTypeId,
                inverse: true,
                transaction: transactionId
              }
            ]).then(() => {
              reply.redirect('/archcomponent/'+request.params.id);
            })
            .catch((err) => {
              reply(err);
            });
          }).catch((err) =>{
            reply(err);
          });
      } else {
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
          reply(err);
        });
      }

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
