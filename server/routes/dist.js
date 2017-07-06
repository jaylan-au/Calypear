module.exports = [
  {
    method: 'GET',
    path: '/dist/{filename*}',
    handler: {
      directory: {
        path: './',
      }
    }
  },
];
