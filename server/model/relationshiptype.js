module.exports = {
  identity: 'relationshiptype',
  connection: 'primary',
  attributes: {
    name: {
      type: 'string'
    },
    nameInverse: {
      type: 'string'
    },
    distance: {
      type: 'integer'
    }
  }
}
