module.exports = {
  identity: 'archcomponent',
  connection: 'primary',
  attributes: {
    name: {
      type: 'string',
    },
    type: {
      model: 'componenttype',
    },
  }
}
