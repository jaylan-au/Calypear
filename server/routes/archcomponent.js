const ArchComponent = require('../model/archcomponent');

module.exports = [
  {
    method: 'GET',
    path: '/archcomponents',
    handler: function (request, response) {
      var t = new ArchComponent('testName');
      console.log(t);
      response('Archcomponents');
    },
  },
  {
    method: 'GET',
    path: '/archcomponent/{id}',
    handler: function (request, response) {
      response('Archcomponents' + request.params.id);
    },
  }
];
