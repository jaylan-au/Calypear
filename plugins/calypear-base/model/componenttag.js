module.exports = {
  identity: 'componenttag',
  connection: 'primary',
  attributes: {
    tag: {
      model: 'tagtype',
    },
    component: {
      model: 'archcomponent',
    },
    value: {
      type: 'string'
    }
  }
}
