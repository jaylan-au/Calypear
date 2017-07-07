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
    alternativeNames: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    relationships: {
      collection: 'componentrelation',
      via: 'from',
    }
  }
}
