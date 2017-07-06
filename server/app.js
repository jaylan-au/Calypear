'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');

const ArchComponent = require('./model/archcomponent');



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
server.register(require('inert'), (err) =>{
  Hoek.assert(!err, err);
});

server.register(require('vision'), (err) => {

  Hoek.assert(!err, err);

  server.views({
      engines: {
          hbs: require('handlebars')
      },
      relativeTo: __dirname,
      path: 'templates',
      layout: true,
      layoutPath: 'templates/layout',
  });
})

/*
  Register routes
*/
var routes = require('./routes');
server.route(routes);


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
