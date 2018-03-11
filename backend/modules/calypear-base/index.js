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
    const PassportJWT = require('passport-jwt');
    const JWTStrategy = PassportJWT.Strategy;
    const ExtractJWT = PassportJWT.ExtractJwt;
    const jwt = require('jsonwebtoken');
    const odm = app.get('odm');

    // passport.use(new JWTStrategy({
    //   secretOrKey: 'test1',
    //   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // },function(jwt_payload, done){
    //   console.log(jwt_payload);
    //   done(null,jwt_payload.sub);
    // }));

    passport.use(new LocalStrategy({
      passReqToCallback: true,
      session: false,
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
      passport.authenticate('local', { failureRedirect: '/login'}),
      function(req, res) {
        res.status(200).send(req.user);
      }
    );
    // app.post('/login/local',function(req,res,next) {
    //   const odm = req.app.get('odm');
    //   const AppUser = odm.models.appuser;
    //   let username = req.body.username;
    //   let password = req.body.password;
    //   AppUser.find({selector: { username: username }}).then((dbresponse) => {
    //
    //     if (!dbresponse) {
    //       res.status(401).json({message: 'Incorrect username'});
    //       //return done(null, false, { message: 'Incorrect username.' });
    //     } else {
    //       if (!AppUser.authenticatePassword(dbresponse[0].authentication,password)) {
    //         res.status(401).json({message: 'Incorrect username'});
    //         //return done(null, false, { message: 'Incorrect password.' });
    //       } else {
    //         let jwtPayload = {
    //           username: dbresponse[0].username,
    //           sub: dbresponse[0]._id,
    //           testing: 'sdfgsdfgsdfgsdfg',
    //         }
    //         var token = jwt.sign(jwtPayload, 'test1');
    //         res.json({message: "ok", token: token});
    //       }
    //     }
    //   }).catch((err) => {
    //     console.log(err);
    //     res.status(500).json(err);
    //   });
    //
    // });
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
