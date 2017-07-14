module.exports = [].concat(
  require('./archcomponent'),
  require('./componenttype'),
  require('./relationshiptype'),
  require('./dist'),
  require('./vis'),
  require('./tagtype'),
  require('./admin'),
  {
    method: 'GET',
    path: '/',
    handler: {
      view: 'index'
    }
  }
);
