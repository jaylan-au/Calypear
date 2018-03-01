const express = require('express');

let pluginModule = {
  checkAndCreateAdminUser(app) {
    //Checks if atleast 1 user exists and creates an admin user if not
    //used to quick start the database
    const odm = app.get('odm');
    const AppUser = odm.models.appuser;

    AppUser.find().then((dbresponse) => {
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
  authSetup(app) {
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy;
    const odm = app.get('odm');

    passport.use(new LocalStrategy({
      passReqToCallback: true,
    },
      function(req, username, password, done) {
        const odm = req.app.get('odm');
        const AppUser = odm.models.appuser;

        AppUser.find({selector: { username: username }}).then((dbresponse) => {

          if (!dbresponse) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          if (!AppUser.authenticatePassword(dbresponse[0].authentication,password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, dbresponse[0]);
        }).catch((err) => {
          console.log(err);
          return done(err);
        })
      }
    ));

    passport.serializeUser(function(req, user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(req, id, done) {
      const odm = req.app.get('odm');
      const AppUser = odm.models.appuser;
      AppUser.get(id).then((dbresponse) => {
        if (dbresponse) {
          done(null, dbresponse);
        } else {
          done(err, false);
        }
      }).catch((err) => {
        done(err, false);
      });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.set('passport',passport);


    app.post('/login/local',
      passport.authenticate('local', { failureRedirect: '/login' }),
      function(req, res) {
        res.sendStatus(200);
      }
    );
  },
  initialize: function(app,mountPath) {
    const odm = app.get('odm');
    //Register the models
    odm.define(require('./models'));



    //Setup appUsers
    this.checkAndCreateAdminUser(app);
    this.authSetup(app);

    //ROUTES must be registered AFTER the auth setup - so Passport can attach deserializeUser to them

    //Initialize the routes
    let router = require('./routes');
    //Register at the requested  mountPath
    app.use(mountPath,router);
  },
}

module.exports = pluginModule;
