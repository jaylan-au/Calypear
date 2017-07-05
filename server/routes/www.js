module.exports = [
  {
    method: 'GET',
    path: '/www/{filename*}',
    handler: {
      directory: {
        path: './',
      }
    }
  },
];
