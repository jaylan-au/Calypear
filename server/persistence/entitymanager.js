const low = require('lowdb');
const uuidv4 = require('uuid/v4');
const ComponentType = require('../model/componenttype');

/*
  Simple Entity Manager - Could use full persistence layer but that's probably
  Not required for something this simple.
*/
class EntityManager {
  //Initialise and hold a database connection open
  //Allow for persistence of objects
  constructor() {
      this._db = low('db.json');
      this._db.defaults({
        archcomponents: [],
        lookuptypes: [],
        relationshiptypes: [],
        componenttypes: [],
      }).write();
  }

  db() {
    return this._db;
  }

  uuid() {
    return uuidv4();
  }

  getComponentTypes() {
    var dbResult = this.db().get('componenttypes').value();
    var componentTypes = [];
    dbResult.forEach(function(item) {
      var newType = new ComponentType(item.name, item.id);
      componentTypes.push(newType);
    });
    return componentTypes;
  }
}

module.exports = EntityManager;
