const Joi = require('Joi');
module.exports = {
  docType: 'appuser',
  attributes: {
    username: Joi.string().min(1).required(),
    authentication: Joi.string().min(1).required(),
  },
  methods: {
    encodePassword: function(plaintext) {
      const bcrypt = require('bcryptjs');
      const saltRounds = 10;
      return bcrypt.hashSync(plaintext, saltRounds);
    },
    authenticatePassword: function(hashedPassword, plantextPassword) {
      const bcrypt = require('bcryptjs');
      return bcrypt.compareSync(plantextPassword, hashedPassword); // false
    },
    createUser: function(userProps) {
      let userObject = {};
      userObject.username = userProps.username;
      userObject.authentication = this.encodePassword(userProps.authentication);
      //Check the user doesn't already exist
      return this.find({
        selector: {
          username: userObject.username
        }
      }).then((dbresponse) => {
        if (dbresponse.length < 1) {
          //No user detected - create it
          return this.create(userObject).then((createResponse) => {
            return createResponse.data;
          });
        } else {
          return Promise.reject(new Error(409,'User exists'));
        }
      }).catch((err) => {
        return Promise.reject(err);
      });
    }
  }
};
