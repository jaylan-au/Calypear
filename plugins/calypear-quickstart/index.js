'use strict';
const usersExist = function(next) {
  const AppUser = this.collections(true).appuser;

  //next(Err,result,ttl)
  AppUser.find().limit(1).then((result) => {
    if (result.length > 0) {
      this.log(['calypear','database','read','quickstart'],'Quickstart Detected atleast 1 user in the database - this will likely mean quickstart will not run');
      next(null, false);
    } else {
      this.log(['app','database','read','quickstart'],'Quickstart Detected no users in the database - this will probably result in a default user being created');
      next(null, true);
    }
  }).catch((err) => {
    //Respond with just the error
    console.log(err)
    next(err,false);
  });
}

//Creates a default admin user
const createDefaultUser = function(next) {
  const AppUser = this.collections(true).appuser;
  var defaultUser = {
    username: 'admin',
    authentication: AppUser.hashPassword('admin'),
    userType: 'real',
    expires: null
  }
  //next(Err,result,ttl)
  AppUser.create(defaultUser).then((result) => {
    this.log(['app','database','write','quickstart'],'Default Admin user created, username: '+result.username+', Password: '+result.username);
    next(null, result, 0);
  }).catch((err) => {
    //Respond with just the error
    next(err)
  });
}
//This Plugin registers a single server method to setup a new database
//At the moment this plugin onyl creates a default admin user - simply so
//users can login and perform their own setup
//This plugin MUST register last
var calypearQuickstart = {
  register: function (server, options, next) {
      //This plugin has no routes

      //This plugin does not register any models

      //This plugin does not have any views

      //Register the server method to assess if a database is required
      //This checks if any users are registered -

      //Register the server method to create a new database
      server.method({
          name: 'quickstart.isRequired',
          method: usersExist,
          options: {bind: server}
      });

      server.method({
          name: 'quickstart.execute',
          method: createDefaultUser,
          options: {bind: server}
      });
      next();
  },
}


calypearQuickstart.register.attributes = {
    name: 'calypear-quickstart',
    version: '0.1'
};

module.exports = calypearQuickstart;
