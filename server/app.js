'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');


const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'dist')
      }
    }
  },
  debug: {
    log: ['error'],
    request: ['error']
  }
});

server.connection({ port: 3000, host: 'localhost' });

/*
  Register Plugins
*/
//Static Content Plugin
server.register(require('inert'), (err) =>{
  Hoek.assert(!err, err);
});
//Views Rendering Plugin + Configuration
server.register(require('vision'), (err) => {
  Hoek.assert(!err, err);
  server.views({
      engines: {
          hbs: require('handlebars')
      },
      isCached: false,
      relativeTo: __dirname,
      path: 'templates',
      layoutPath: 'templates/layout',
      layout: true,
      partialsPath: 'templates/partials',
      helpersPath: 'templates/helpers'
  });
})
//ORM Dogwater/Waterline
const Dogwater = require('dogwater');
const SailsDisk = require('sails-disk');
server.register({
  register: Dogwater,
  options: {
    adapters: {
      disk: SailsDisk
    },
    connections: {
      primary: { adapter: 'disk' }
    },
    models: require('./model'),
  }
}, (err) => {
  Hoek.assert(!err, err);
  // Define a model using a connection declared above
});

/*
  Register routes
*/
var routes = require('./routes');
server.route(routes);

/*
  Calypear Plugins
*/
server.register({
    register: require('../plugins/calypear-base'),
    options: {
      globalTemplates: {
        layout: '../../server/templates/layout',
        partials: '../../server/templates/partials',
        helpers: '../../server/templates/helpers'
      }
    }
  },
  {
  },
  (err) => {
    Hoek.assert(!err,err);
});

server.register({
    register: require('../plugins/calypear-admin'),
    options: {
      globalTemplates: {
        layout: '../../server/templates/layout',
        partials: '../../server/templates/partials',
        helpers: '../../server/templates/helpers'
      }
    }
  },
  {
  },
  (err) => {
    Hoek.assert(!err,err);
});


server.register({
    register: require('../plugins/calypear-vis'),
    options: {
      globalTemplates: {
        layout: '../../server/templates/layout',
        partials: '../../server/templates/partials',
        helpers: '../../server/templates/helpers'
      }
    }
  },
  {
  },
  (err) => {
    Hoek.assert(!err,err);
});


server.start((err) => {

    if (err) {
        throw err;
    }

    // const ComponentType = server.collections().componenttype;
    // ComponentType.create([
    //   {name: 'System'},
    //   {name: 'Data'}
    // ]).then(() => {
    //
    //         console.log(`Go find some dogs at ${server.info.uri}`);
    //     })
    //     .catch((err) => {
    //
    //         console.error(err);
    //     });

    console.log(`Server running at: ${server.info.uri}`);
});
