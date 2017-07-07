module.exports = {
  identity: 'componentrelation',
  connection: 'primary',
  attributes: {
    from: {
      model: 'archcomponent',
    },
    to: {
      model: 'archcomponent',
    },
    type: {
      model: 'relationshiptype',
    },
    inverse: {
      type: 'boolean',
    },
    transaction: {
      type: 'string',
    },
  }
}
