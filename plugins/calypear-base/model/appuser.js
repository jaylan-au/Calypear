const uuidv4 = require('uuid/v4');

module.exports = {
  identity: 'appuser',
  connection: 'primary',
  attributes: {
    //Real = Username, API = identifying part of the APIkey
    //This doesn't need to be unique - as long as its the only one thats active
    //(unexpired)
    username: {
      type: 'string',
      size: 128,
    },
    //The user's password or the authenticating part of the APIkey
    //Do not set directly
    authentication: {
      type: 'string',
      size: 128,
    },
    //Type of user e.g. Human, App, Externally Verified - this doesn't imply permissions
    userType: {
      type: 'string',
      enum: ['real','api']
    },
    //Date the user expires
    expires: {
      type: 'date',
      defaultsTo: null
    },

    active: function(){
      return (this.expires == null) || (this.expires.getTime() > new Date().getTime());
    },
    validateAuthentication: function(checkauth) {
      var bcrypt = require('bcrypt');
      return bcrypt.compareSync(checkauth,this.authentication);
    }
  },
  hashPassword: function(authentication) {
    var bcrypt = require('bcrypt');
    return bcrypt.hashSync(authentication, 10);
  },



}
