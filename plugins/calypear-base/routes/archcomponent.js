const uuidv4 = require('uuid/v4');
const Accepts = require('accepts');

module.exports = [
  {
    method: 'GET',
    path: '/archcomponents',
    config: {
      tags: ['primary']
    },
    handler: function (request, reply) {
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
  },
  {
    method: 'POST',
    path: '/archcomponent',
    handler: function (request, reply) {
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
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}/delete',
    handler: function(request, reply) {
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
    }
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}',
    handler: function (request, reply) {
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
  },
  {
    method: 'POST',
    path: '/archcomponent/{id}',
    handler: function (request, reply) {
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
  },
  {
    method: 'POST',
    path: '/archcomponent/{id}/tag',
    handler: function (request, reply) {
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
    }
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}/tag/{tagId}/delete',
    handler: function (request, reply) {
      const ComponentTag = request.server.collections(true).componenttag;

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
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}/relation/{transactionId}/delete',
    handler: function (request, reply) {
      const ComponentRelation = request.server.collections(true).componentrelation;

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
      const ArchComponent = request.server.collections(true).archcomponent;
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
      const ArchComponent = request.server.collections(true).archcomponent;
      const ComponentRelation = request.server.collections(true).componentrelation;
      const ComponentType = request.server.collections(true).componenttype;
      const TagType = request.server.collections(true).tagtype;
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
        }),
        ComponentType.find().then((results) =>{
          //Just get them all for later processing - there's unlikely to be too many in any db
          viewParams.componentTypes = results;
        }),
        ComponentRelation.find().populate(['from','to','type']).then((results) => {
          //first we need to find all the Data Types -> Relations -> Inverse/Not we are interested in
          var typeRelationMap = [];
          //This coudl be done much more effeciently but lets get it working for Now
          //Build the map first
          var typeRelationMap = results.map(function(element){
            return {
                typeId : element.to.type,
                relationTypeId: element.type.id,
                relationTypeName: element.type.name,
                relationTypeNameInverse: element.type.nameInverse,
                inverse: element.inverse
              }
          });

          //Now remove duplicates
          typeRelationMap = typeRelationMap.reduce(function(accumulator, element){
            //Find if the item already exists in the accumulator
            //if so, don't add it (this could be done in a previous step)
            var existing = accumulator.find(function(searchElement){
              return (
                (searchElement.typeId == this.findElement.typeId)
                &&
                (searchElement.relationTypeId == this.findElement.relationTypeId)
                &&
                (searchElement.inverse == this.findElement.inverse)
              );
            },{findElement : element});

            if (!existing) {
              accumulator.push(element);
            }

            return accumulator;
          },[]);
          //Now sort the map - at the momenet this is numeric - but we will change that
          typeRelationMap = typeRelationMap.sort(function(a,b){
            //Order by Type -> RelationType -> Inverse/Not
            if (a.typeId == b.typeId) {
              if (a.relationTypeId == b.relationTypeId ) {
                return a.inverse - b.inverse;
              } else {
                return a.relationTypeId - b.relationTypeId;
              }
            } else {
              return a.typeId - b.typeId;
            }
          });

          viewParams.typeRelationMap = typeRelationMap;
          //Now build a map of each component type
          //Done here instead of above as this will know component types for ALL
          //components in the set of data we're interested in (included related items)

          var relComponentTypeMap = results.reduce(function(accumulator, element){
            var existing = accumulator.find(function(searchElement){
              return (searchElement.componentId == element.to.id);
            },{findElement: element});

            if (!existing) {
              accumulator.push({
                componentId: element.to.id,
                typeId: element.to.type
              })
            }
            return accumulator;
          },[]);

          viewParams.relComponentTypeMap = relComponentTypeMap;
          viewParams.componentRelations = results;

        })
      ]).then(() => {
        //fill the Component Type Names into the typeRelationMap
        viewParams.typeRelationMap.forEach(function(typeRelation){
          typeRelation.typeName = viewParams.componentTypes.find(function(testingElement){
            return (testingElement.id == this)
          },typeRelation.typeId).name;
        });

        viewParams.components.forEach(function(archComponent){
          //Map the data onto a row based table
          archComponent.tagRow = [];
          if (archComponent.tags) {
             viewParams.interestingTags.forEach(function(tagType, tagTypeIndex){
              archComponent.tagRow[tagTypeIndex] = archComponent.tags.filter(function(componentTag){
                return (componentTag.tag == tagType.id);
              });
            });
          }

          //Now the fun part - map the relations onto the typeRelationMap
          archComponent.relationRow = [];
          if(archComponent.relationships) {
            viewParams.typeRelationMap.forEach(function(typeRelation, typeRelationIndex){
              //Get a list of possible matching component ids
              //console.log(viewParams);
              var matchingComponents = viewParams.relComponentTypeMap.filter(function(testingElement){
                  return (testingElement.typeId == this)
                },typeRelation.typeId)
                .map(function(mappingElement){
                  return mappingElement.componentId;
                });

              //filter the relations down to the set we're looking for
              //Build from the full list of relations - as he component list
              //Doesn't have the related components populated
              var matchingRelations = viewParams.componentRelations.filter(function(testingElement){
                return (
                  //Filter down to the component we are processing relations for
                  (testingElement.from.id == archComponent.id)
                  &&
                  //Does the Relation Type Match
                  (testingElement.type.id == this.relationTypeId)
                  &&
                  //Does the inverse/not match
                  (testingElement.inverse == this.inverse)
                  &&
                  //Is the component type right
                  (matchingComponents.includes(testingElement.to.id))
                )
              },typeRelation)
              //console.log(matchingRelations);
              archComponent.relationRow[typeRelationIndex] = matchingRelations;
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
