
const Accepts = require('accepts');
const LoginController = require('../controller/login');

module.exports = [
  {
    method: "GET",
    path: '/login',
    config: {
      tags: [],
      auth: false
    },
    handler: LoginController.loginRequest,
  },
  {
    method: "POST",
    path: '/login',
    config: {
      tags: [],
      auth: false
    },
    handler: LoginController.attemptLogin,
  }
];
