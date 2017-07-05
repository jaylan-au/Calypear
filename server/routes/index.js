var archcomponentRoutes = require('./archcomponent');
var wwwRoutes = require('./www');

module.exports = [].concat(
  archcomponentRoutes,
  wwwRoutes
);
