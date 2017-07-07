module.exports = {
  identity: 'relationshiptype',
  connection: 'primary',
  attributes: {
    name: {
      type: 'string'
    },
    inverseName: {
      type: 'string'
    },
  }
}
