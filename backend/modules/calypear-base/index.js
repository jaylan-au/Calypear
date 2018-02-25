const express = require('express');

let pluginModule = {
  checkAndCreateAdminUser(app) {
    //Checks if atleast 1 user exists and creates an admin user if not
    //used to quick start the database
    const odm = app.get('odm');
    const AppUser = odm.models.appuser;

    AppUser.find().then((dbresponse) => {
      console.log('f',dbresponse);
      if (dbresponse.length < 1) {
        //Create the user
        AppUser.createUser({
          username: 'admin',
          authentication: 'admin'
        }).then((createdUser) => {
          console.log(createdUser);
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  initialize: function(app,mountPath) {
    const odm = app.get('odm');
    //Register the models
    odm.define(require('./models'));

    //Initialize the routes
    let router = require('./routes');
    //Register at the requested  mountPath
    app.use(mountPath,router);

    //Setup appUsers
    this.checkAndCreateAdminUser(app);
  },
}

module.exports = pluginModule;
