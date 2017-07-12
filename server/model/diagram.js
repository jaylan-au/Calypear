module.exports = {
  identity: 'diagram',
  connection: 'primary',
  attributes: {
    name: {
      type: 'string',
    },
    components: {
      collection: 'diagramcomponent'
    },
  }
}
