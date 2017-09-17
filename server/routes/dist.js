module.exports = [
  {
    method: 'GET',
    path: '/dist/{filename*}',
    config: {
      auth: false,
    },
    handler: {
      directory: {
        path: './',
      }
    }
  },
];
