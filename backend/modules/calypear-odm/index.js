const express = require('express');

let pluginModule = {
  initialize: function(app) {
    const CalypearODM = require('./calypear-odm');
    var calypearODM = new CalypearODM(app.get('appdb'));
    app.set('odm',calypearODM);
    //Register the routes here
    return this;
  },

}

module.exports = pluginModule;
