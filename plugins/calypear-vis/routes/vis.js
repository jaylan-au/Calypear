const DiagramController = require('../controller/diagramcontroller');

module.exports = [
  {
    method: 'GET',
    path: '/vis',
    handler: DiagramController.getDiagram,
  },
  {
    method: 'GET',
    path: '/diagrams',
    handler: DiagramController.searchDiagrams,
  },
  {
    method: 'GET',
    path: '/diagram/{id}',
    handler: DiagramController.getDiagram,
  },
  {
    method: 'GET',
    path: '/diagram/{id}/delete',
    handler: DiagramController.deleteDiagram,
  },
  {
    method: 'POST',
    path: '/diagram',
    handler: DiagramController.createDiagram,
  },
  {
    method: 'POST',
    path: '/diagram/{id}',
    handler: DiagramController.updateDiagram,
  }

]
