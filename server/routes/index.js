var archcomponentRoutes = require('./archcomponent');
var distRoutes = require('./dist');

module.exports = [].concat(
  archcomponentRoutes,
  distRoutes
);
