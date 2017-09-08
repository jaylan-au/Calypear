const Accepts = require('accepts');
const ArchComponentController = require('../controller/archcomponent');

module.exports = [
  {
    method: 'GET',
    path: '/archcomponents',
    config: {
      tags: ['primary']
    },
    handler: ArchComponentController.searchComponents,
  },
  {
    method: 'POST',
    path: '/archcomponent',
    handler: ArchComponentController.createComponent,
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}/delete',
    handler: ArchComponentController.deleteComponent,
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}',
    handler: ArchComponentController.getComponent,
  },
  {
    method: 'POST',
    path: '/archcomponent/{id}',
    handler: ArchComponentController.updateComponent,
  },
  {
    method: 'POST',
    path: '/archcomponent/{id}/tag',
    handler: ArchComponentController.createTag,
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}/tag/{tagId}/delete',
    handler: ArchComponentController.deleteTag,
  },
  {
    method: 'POST',
    path: '/archcomponent/{id}/relation',
    handler: ArchComponentController.createRelationship,
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}/relation/{transactionId}/delete',
    handler: ArchComponentController.deleteRelationship,
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
