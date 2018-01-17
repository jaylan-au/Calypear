'use strict';
const CalypearModel = require('./calypear-model');

class CalypearODM {
  constructor(db) {
    this._db = db;
    this._models = {};
  }

  /*
    Note: Defining a new document with the same doctype will override any existing definitions
  */
  define(definitions) {
    var definitionPromises = [];
    //Coerce definitions to an array if its not already
    if (!(Array.isArray(definitions))) {
      definitions = [].concat(definitions);
    }

    definitions.forEach((definition) => {
      //FIXME: docType is actually available from the Model itself - filter the array instead of storing this

      let docModel = CalypearModel.define(this._db,definition);
      this._models[docModel.docType] = docModel;
    });

    return this._models;
  }

  get models() {
    return this._models;
  }
}

module.exports = CalypearODM;
