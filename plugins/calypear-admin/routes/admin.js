module.exports = [
  {
    method: 'GET',
    path: '/admin/exportdb/{format}',
    handler: function (request, reply) {
      //Export the Database in a readable format
      const ArchComponent = request.server.collections(true).archcomponent;
      const TagType = request.server.collections(true).tagtype;
      const RelationshipType = request.server.collections(true).relationshiptype;
      const ComponentType = request.server.collections(true).componenttype;
      var viewParams = {};
      Promise.all([
        ArchComponent.find()
          .populate(['type','tags','relationships'])
          .then((results) => {
            viewParams.archComponents = results;
          }),
        TagType.find()
          .then((results) => {
            viewParams.tagTypes = results;
          }),
        RelationshipType.find()
          .then((results) => {
            viewParams.relationshipTypes = results;
          }),
        ComponentType.find()
          .then((results) => {
            viewParams.componentTypes = results;
          })
      ]).then(() => {
        viewParams.exportData = {
          exportedAt: Date(),
          format: request.params.format,
          exporter: 'calypear',
          system: request.info.hostname
        }
        switch (request.params.format) {
          case 'json-object':
            reply.view('admin/export/json-object.hbs',viewParams,{ layout: false})
              .type('text/json')
              .header("Content-Disposition", "attachment; filename=\"calypear.json\"");
            break;
        }
      }).catch((err) => {
        reply(err);
      })
    }
  },
  {
    method: 'POST',
    path: '/admin/importdb/{format}',
    config: {
      payload: {
        output: 'data'
      }
    },
    handler: function (request, reply) {
      //Export the Database in a readable format
      const ArchComponent = request.server.collections(true).archcomponent;
      const ComponentTag = request.server.collections(true).componenttag;
      const ComponentRelation = request.server.collections(true).componentrelation;
      const TagType = request.server.collections(true).tagtype;
      const RelationshipType = request.server.collections(true).relationshiptype;
      const ComponentType = request.server.collections(true).componenttype;
      var  loadedData = JSON.parse(request.payload.toString());
      /* Trim out the ID's in objects connected to the archComponents
      to allow the create statement to automatically reconnect them for us
      other wise it will ignore attached objects
      */

      loadedData.archComponents.forEach(function(archComponent){
        archComponent.tags.forEach(function(tag){
          delete(tag.id);
        });
        archComponent.relationships.forEach(function(relationship){
          delete(relationship.id);
        });
      });
      //TODO: Put some actual error checking and parsing here
      //Empty out the database

      Promise.all([
        ComponentTag.destroy(),
        ComponentRelation.destroy(),
        ArchComponent.destroy(),
        TagType.destroy(),
        RelationshipType.destroy(),
        ComponentType.destroy(),
      ]).then(() => {
        //Now start importing - let the error bubble up
        console.log('DB cleared  - Loading Data');
        Promise.all([
          ComponentType.create(loadedData.componentTypes),
          RelationshipType.create(loadedData.relationshipTypes),
          TagType.create(loadedData.tagTypes),
          ArchComponent.create(loadedData.archComponents)
        ]).then(() => {
          reply('OK');
        });
      }).catch((err) =>{
        reply(err);
      })

    }
  },
  {
    method: 'GET',
    path: '/admin',
    config: {
      tags: ['primary']
    },
    handler: function(request, reply) {
      reply.view('admin/index.hbs');
    }
  }
]
