const uuidv4 = require('uuid/v4');
const Accepts = require('accepts');
const Boom = require('boom');


module.exports = {
  loginRequest: function(request, reply){
    //show login form
    reply.view('login/login.hbs',{redirectSuccess: request.query.redirect})
  },
  attemptLogin: function(request, reply){
    const AppUser = request.server.collections(true).appuser;
    if (request.payload.username) {
      AppUser.findOne({
        username: request.payload.username,
        or: [
          {expires: null},
          {expires: {'>': new Date()}},
        ]
      }).then((result) => {
        if (result) {
          //check password
          if (result.validateAuthentication(request.payload.password)) {
            //User validated - generate a token
            var JWT   = require('jsonwebtoken');
            var obj   = {
              "id": result.id,
              "username": result.username,
              "expires": result.expires,
              "sessionip": request.info.remoteAddress
            }; // object/info you want to sign
            var token = JWT.sign(obj, "ReplaceMeWithAnActualKey",{ algorithm: 'HS256' });

            var cookie_options = {
              ttl: null, // expires a year from today
              encoding: 'none', // we already used JWT to encode
              isSecure: false, // warm & fuzzy feelings
              isHttpOnly: true, // prevent client alteration
              clearInvalid: false, // remove invalid cookies
              strictHeader: true, // don't allow violations of RFC 6265
              path: '/' //rc
            };
            var forwardToUrl = "/";
            if (request.payload.redirectSuccess) {
              forwardToUrl = request.payload.redirectSuccess;
            }
            request.log(['app','security','login-success'],{message: "User Logged in", object: obj});
            reply.redirect(forwardToUrl).state("token",token,cookie_options);
          } else {
            //Password invalid - be grumpy
            request.log(['app','security','login-failed'],{message: "Failed login - invalid password", user: request.payload.username});
            reply.redirect('/login');
          }
        } else {
          //usernot found
          request.log(['app','security','login-failed'],{message: "Failed login - unknown or expired user", user: request.payload.username});
          reply.redirect('/login');
        }
      }).catch((err) => {
        reply(err);
      })
    }
  }
}
