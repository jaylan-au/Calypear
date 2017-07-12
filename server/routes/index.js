module.exports = [].concat(
  require('./archcomponent'),
  require('./componenttype'),
  require('./relationshiptype'),
  require('./dist'),
  require('./vis'),
  require('./tagtype'),
  {
    method: 'GET',
    path: '/',
    handler: {
      view: 'index'
    }
  }
);
