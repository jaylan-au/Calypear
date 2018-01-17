const express = require('express');

let pluginModule = {
  initialize: function(app,mountPath) {
    const odm = app.get('odm');
    //Register the models
    odm.define(require('./models'));

    //Initialize the routes
    let router = require('./routes');
    //Register at the requested  mountPath
    app.use(mountPath,router);
  },
}

module.exports = pluginModule;
