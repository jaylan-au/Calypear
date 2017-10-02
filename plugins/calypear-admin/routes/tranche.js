const Accepts = require('accepts');
const TrancheController = require('../controller/tranche');

module.exports = [
  {
    method: 'GET',
    path: '/admin/tranches',
    config: {
      tags: ['primary']
    },
    handler: TrancheController.searchTranches,
  },
  {
    method: 'GET',
    path: '/admin/tranche/{id}',
    config: {
      tags: []
    },
    handler: TrancheController.getTranche,
  },
  {
    method: "POST",
    path: '/admin/tranche',
    config: {
      tags: []
    },
    handler: TrancheController.createTranche,
  },
  {
    method: "POST",
    path: '/admin/tranche/{id}',
    config: {
      tags: []
    },
    handler: TrancheController.updateTranche,
  },
  {
    method: "GET",
    path: '/admin/tranche/{id}/delete',
    config: {
      tags: []
    },
    handler: TrancheController.deleteTranche,
  }
];
