const Accepts = require('accepts');
const ProfileController = require('../controller/profile');

module.exports = [
  {
    method: 'GET',
    path: '/admin/profiles',
    config: {
      tags: ['primary']
    },
    handler: ProfileController.searchUserProfiles,
  },
  {
    method: 'GET',
    path: '/admin/profile/{id}',
    config: {
      tags: []
    },
    handler: ProfileController.getUserProfile,
  },
  {
    method: "POST",
    path: '/admin/profile',
    config: {
      tags: []
    },
    handler: ProfileController.createUserProfile,
  },
  {
    method: "POST",
    path: '/admin/profile/{id}',
    config: {
      tags: []
    },
    handler: ProfileController.updateUserProfile,
  },
  {
    method: "GET",
    path: '/admin/profile/{id}/delete',
    config: {
      tags: []
    },
    handler: ProfileController.deleteUserProfile,
  },
  {
    method: "GET",
    path: '/login',
    config: {
      tags: [],
      auth: false
    },
    handler: ProfileController.loginRequest,
  },
  {
    method: "POST",
    path: '/login',
    config: {
      tags: [],
      auth: false
    },
    handler: ProfileController.attemptLogin,
  }
];
