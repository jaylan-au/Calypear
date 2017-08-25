module.exports = [].concat(
  require('./dist'),
  {
    method: 'GET',
    path: '/',
    handler: {
      view: 'index'
    }
  }
);
