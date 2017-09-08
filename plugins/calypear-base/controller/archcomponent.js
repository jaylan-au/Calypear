const uuidv4 = require('uuid/v4');
const Accepts = require('accepts');

module.exports = {
  searchComponents: function (request, reply) {
    const ArchComponent = request.server.collections(true).archcomponent;
    const ComponentType = request.server.collections(true).componenttype;

    var viewParams = {};
    viewParams.filter = {};


    Promise.all([
      ComponentType.find().then(function(types){
        viewParams.componentTypes = types;
      }),
      new Promise(function(resolve, reject){
        var accessor = ArchComponent.find()
          .populate('type')
          .sort('name');
          if (request.query.typeId) {
            accessor.where({type: request.query.typeId});
            viewParams.filter.typeId = request.query.typeId;
          }
          if (request.query.componentId) {
            accessor.where({id: request.query.componentId});
            viewParams.filter.Id = request.query.componentId;
          }
          if (request.query.detailed) {
            accessor.populate(['relationships','tags'])
            viewParams.filter.detailed = true;
          }
          if (request.query.name) {
            accessor.where({name: {'like': '%'+request.query.name+'%'}});
            viewParams.filter.name = request.query.name;
          }
          accessor.then(function(elements) {
            viewParams.archComponents = elements
            resolve(elements);
          }).catch((err) => {
            reject(err);
          });
      })
    ]).then(function(){
      switch (Accepts(request.raw.req).type(['json','html'])) {
        case 'json':
          //Build the response object
          reply(viewParams);
        break;
        default:
          reply.view('archcomponent/archcomponents.hbs',viewParams);
      }
    }).catch(function(err){
      reply(err);
    });
  },
  createComponent: function (request, reply) {
    const ArchComponent = request.server.collections(true).archcomponent;
    ArchComponent.create({
      name: request.payload.name,
      type: request.payload.typeId,
    })
    .then((createdComponent) => {
      if (request.payload.forwardToEdit) {
        reply.redirect('/archcomponent/'+createdComponent.id);
      } else {
        reply.redirect('/archcomponents');
      }
    })
    .catch((err) => {
      reply(err);
    });
  },
  getComponent: function (request, reply) {
    const ArchComponent = request.server.collections(true).archcomponent;
    const RelationshipType = request.server.collections(true).relationshiptype;
    const ComponentRelation = request.server.collections(true).componentrelation;
    const ComponentType = request.server.collections(true).componenttype;
    const ComponentTag = request.server.collections(true).componenttag;
    const TagType = request.server.collections(true).tagtype;

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

    }).catch(function(err){
      reply(err);
    })
  },
  updateComponent: function (request, reply) {
    const ArchComponent = request.server.collections(true).archcomponent;
    ArchComponent.update({
      id: request.params.id
    },{
      name: request.payload.name,
      type: request.payload.typeId,
      description: request.payload.description,
      alternativeNames: request.payload.alternativeNames,
      docUrl: request.payload.docUrl
    }
    ).then(() => {
      reply.redirect('/archcomponent/'+request.params.id);
    }).catch((err) => {
      reply(err);
    });
  },
  deleteComponent: function(request, reply) {
    const ArchComponent = request.server.collections(true).archcomponent;
    const ComponentRelation = request.server.collections(true).componentrelation;

    Promise.all([
      ArchComponent.destroy({id : request.params.id}),
      ComponentRelation.destroy({from: request.params.id}),
      ComponentRelation.destroy({to: request.params.id})
    ]).then(()=>{
      reply.redirect('/archcomponents');
    }).catch((err)=>{
      reply(err);
    });
  },
  createRelationship: function (request, reply) {
    const ArchComponent = request.server.collections(true).archcomponent;
    const ComponentRelation = request.server.collections(true).componentrelation;
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
  deleteRelationship: function (request, reply) {
    const ComponentRelation = request.server.collections(true).componentrelation;

    ComponentRelation.destroy({transaction: request.params.transactionId}).then(function(){
      reply.redirect('/archcomponent/'+request.params.id)
    }).catch(function(err){
      reply(err);
    });

  },
  createTag: function (request, reply) {
    const ComponentTag = request.server.collections(true).componenttag;

    ComponentTag.create({
      component: request.params.id,
      tag: request.payload.tagTypeId,
      value: request.payload.value
    }).then(() => {
      reply.redirect('/archcomponent/'+request.params.id);
    }).catch((err) => {
      reply(err);
    });
  },
  deleteTag: function (request, reply) {
    const ComponentTag = request.server.collections(true).componenttag;

    ComponentTag.destroy({id: request.params.tagId}).then(() => {
      reply.redirect('/archcomponent/'+request.params.id);
    }).catch((err) => {
      reply(err);
    });
  }
}
