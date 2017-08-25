'use strict';

var calypearbase = {
  register: function (server, options, next) {
      //Plug Routes
      var routes = require('./routes');
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


calypearbase.register.attributes = {
    name: 'calypear-base',
    version: '0.1'
};

module.exports = calypearbase;
