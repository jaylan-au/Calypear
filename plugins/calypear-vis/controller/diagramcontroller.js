const Accepts = require('accepts');

module.exports = {
  searchDiagrams: function(request, reply) {
    const Diagram = request.server.collections(true).diagram;

    Diagram.find().then((results) => {
      reply.view('vis/diagrams.hbs',{
        diagrams: results
      })
    }).catch((err) => {
      reply(err);
    });
  },
  createDiagram: function(request, reply) {
    const Diagram = request.server.collections(true).diagram;
    const DiagramComponent = request.server.collections(true).diagram;
    var payloadDiagram = request.payload.diagram;
    var newDiagram = {
      name: payloadDiagram.name,
      components: payloadDiagram.components
    }

    Diagram.create(newDiagram).then((createdObject) => {
      request.log(['data-change','app'], {message: 'Diagram Created', object: createdObject});
      reply(createdObject);
    }).error((err)=>{
      reply(err);
    });
  },
  getDiagram: function(request, reply) {
    //Design to retrieve the shell of a diagram only.
    //Subsequent calls are really required to get the details
    const Diagram = request.server.collections(true).diagram;
    var viewParams = {
      layout: {
        fullwidth: true
      },
      diagramId: request.params.id
    }

    //If a component id was passed then pass this to the view (which will load and expand the component)
    if (request.query.componentId) {
      viewParams.componentId = request.query.componentId;
    }
    Promise.all([
      Diagram.find({id: request.params.id})
        .populate(['components'])
        .then((results) => {
        viewParams.diagram = results;
      })
    ]).then(() => {
      switch (Accepts(request.raw.req).type(['json','html'])) {
        case 'json':
          reply(viewParams);
        break;
        default:
          reply.view('vis/visbase.hbs',viewParams);
      }
    }).catch((err) => {
      reply(err);
    });
  },
  updateDiagram: function(request, reply) {
    const Diagram = request.server.collections(true).diagram;
    const DiagramComponent = request.server.collections(true).diagram;
    var payloadDiagram = request.payload.diagram;

    Diagram.find({id: request.params.id}).populate(['components']).then((dbDiagram) => {
      //Set the Diagram Properties
      dbDiagram.name = payloadDiagram.name;

      //Merge the components

      payloadDiagram.components.forEach((mergeComponent) => {
        //Find the component in the result
        var mergeTo = dbDiagram.components.find((dbDiagComponentLink) => {
          return dbDiagComponentLink.component == mergeComponent.component;
        });

        if (mergeTo) {
          //Update the properties for MergeTO
          if (mergeComponent.fixedX) {
            mergeTo.fixedX = mergeComponent.fixedX;
          }

          if (mergeComponent.fixedY) {
            mergeTo.fixedY = mergeComponent.fixedY;
          }

        } else {
          //Add the item into the component list
          serverDiagram.components.add({
            component: mergeComponent.component,
            fixedX: mergeComponent.fixedX,
            fixedY: mergeComponent.fixedY
          });
        }
      });

      //Now remove any Components on the server thate aren't on the payload
      //do this the safe way in case the collection updates
      var componentIdsInPayload = payloadDiagram.components.map((mergeComponent) => {
        return mergeComponent.component;
      });

      //Return an array of all items linking to Components not in the diagram
      var componentLinksToRemove = dbDiagram.components.filter((dbDiagComponentLink) => {
        return !(componentIdsInPayload.incudes(dbDiagComponentLink.component));
      });

      componentLinksToRemove.forEach((linkToRemove) => {
        dbDiagram.components.remove(linkToRemove.id);
      });

      //Dedupe

      dbDiagram.save().then(()=>{
        request.log(['data-change','app'], {message: 'Diagram Updated', object: dbDiagram.id});
        reply(dbDiagram);
      }).error((err) => {
        reply(err);
      });
    }).error((err)=>{
      reply(err);
    });
  },
  deleteDiagram: function(request, reply) {
    //Delete a diagram and all of its links
    const Diagram = request.server.collections(true).diagram;
    const DiagramComponent = request.server.collections(true).diagram;
    Promise.all([
      Diagram.destroy({id: request.params.id}),
      DiagramComponent.destroy({diagram: request.params.id})
    ]).then(() => {
      request.log(['data-change','app'], {message: 'Diagram Deleted', object: request.params.id});
      reply.redirect('/diagrams');
    }).catch((err) => {
      reply(err);
    });
  }
}
