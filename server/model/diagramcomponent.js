module.exports = {
  identity: 'diagramcomponent',
  connection: 'primary',
  attributes: {
    component: {
      model: 'archcomponent',
    },
    fixedX: {
      type: 'integer'
    },
    fixedY: {
      type: 'integer'
    },
    relationPopulationReach: {
      type: 'integer',
      defaultsTo: 0
    },
    relationPopulationHops: {
      type: 'integer',
      defaultsTo: 0
    }
  }
}
