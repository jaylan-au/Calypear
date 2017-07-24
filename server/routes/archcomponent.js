const uuidv4 = require('uuid/v4');
const Accepts = require('accepts');

module.exports = [
  {
    method: 'GET',
    path: '/archcomponents',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      const ComponentType = request.server.collections().componenttype;

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
        reply(err);
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
        reply(err);
      });
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

      }).catch(function(err){
        reply(err);
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
      ).then(() => {
        reply.redirect('/archcomponent/'+request.params.id);
      }).catch((err) => {
        reply(err);
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
        reply(err);
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
        }).type('application/json');
      }).catch(function(err) {
          reply(err);
      });
    }
  },
  {
    method: 'GET',
    path: '/archcomponents/table',
    handler: function (request, reply) {
      const ArchComponent = request.server.collections().archcomponent;
      const TagType = request.server.collections().tagtype;
      var viewParams = {};
      Promise.all([
        ArchComponent.find().populate(['type','tags','relationships']).then((results) => {
          //Now get a list of the Tags/Relationship Types we want to create columns from
          var interestingTagIds = [];

          results.forEach(function(archComponent){
            if (archComponent.tags) {
              archComponent.tags.forEach(function(componentTag){
                interestingTagIds.push(componentTag.tag);
              });
            }
          });
          interestingTagIds = interestingTagIds.filter((v, i, a) => a.indexOf(v) === i);
          viewParams.components = results;
          viewParams.interestingTagIds = interestingTagIds;

          return Promise.all([
            TagType.find({id: interestingTagIds}).then((results) => {
              viewParams.interestingTags = results;
            }),
          ]);
        })
      ]).then(() => {
        //Map the data onto a row based table
        viewParams.components.forEach(function(archComponent){
          archComponent.tagRow = [];
          if (archComponent.tags) {
             viewParams.interestingTags.forEach(function(tagType, tagTypeIndex){
              archComponent.tagRow[tagTypeIndex] = archComponent.tags.filter(function(componentTag){
                return (componentTag.tag == tagType.id);
              });
            });
          }
        });
        //Additional Params for Export Formats
        viewParams.exportData = {
          hostname: request.info.host
        }
        switch (request.query.format) {
          case 'csv':
            reply.view('archcomponent/tableCSV.hbs',viewParams,{layout: false})
            .type('text/csv')
            .header("Content-Disposition", "attachment; filename=\"component-table.csv\"");;
          break;
          default:
            reply.view('archcomponent/table.hbs',viewParams);
        }

      }).catch((err) => {
        reply(err);
      });
    }
  }
];
