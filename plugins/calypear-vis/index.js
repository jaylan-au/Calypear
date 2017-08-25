'use strict';

var calypearvis = {
  register: function (server, options, next) {
      //Plug Routes
      var routes = require('./routes/vis');
      server.route(routes);

      //Register Dogwater Models
      server.dogwater({
        models: require('./model')
      });

      ///Register Views for this plugin
      server.views({
           engines: {
               hbs: require('handlebars')
           },
           isCached: false,
           relativeTo: __dirname,
           path: 'templates',
           layoutPath: options.globalTemplates.layout,
           layout: true,
           partialsPath: options.globalTemplates.partials,
           helpersPath: options.globalTemplates.helpers
       });

      next();
  },
}


calypearvis.register.attributes = {
    name: 'calypear-vis',
    version: '0.1'
};

module.exports = calypearvis;
