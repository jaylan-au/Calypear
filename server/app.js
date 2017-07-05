'use strict';

const Path = require('path');
const Hapi = require('hapi');


const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'www-public')
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
  if (err) {
            throw err;
        }

});

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
