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
    docUrl: {
      type: 'string'
    },
    tags: {
      collection: 'componenttag',
      via: 'component'
    },
    relationships: {
      collection: 'componentrelation',
      via: 'from',
    }
  }
}
