'use strict';
const Joi = require('joi');

//TODO: Assess if key should forcibly include modelname?

class CalypearModel {

  constructor(db,docType, attributes, options) {
    this._db = db;
    this._docType = docType;
    //TODO: Append _id and _rev attributes to the attributes this sets their validation and prevents the validation failing when they are present
    this._attributesDef = Object.assign({}, attributes, {
      docType: Joi.string().alphanum().lowercase(),
      _rev: Joi.string(),
      _id: Joi.string(),
    });
    if (docType == 'archcomponent') {
      console.log('DECLARED');
    }
  }

  static define(db,definition) {
    //FIXME: Forcibly prevent the reserved keys of _id, attributes.docType  and _rev
    const definitionSchema = Joi.object().keys({
      docType: Joi.string().alphanum().lowercase().required(),
      attributes: Joi.object()
        .required()
        .description('Attributes expected for this document type')
        .example('{/* Attribute Definition */}'),
      //Indexes is an array of objects defining indexes to create for the model
      indexes: Joi.array()
        .description('Indexes to create or expect for the object')
        .items(Joi.object().keys({
          name: Joi.string().min(1).alphanum().lowercase().required(),
          attributes: Joi.array().items(Joi.string().min(1)).min(1).required(),
        })),
      //an array of objects defining methods to create for the model
      methods: Joi.array()
        .description('Methods attached to this model'),
    });

    let validatedDefinition = Joi.attempt(definition, definitionSchema);
    let calypearModel = new CalypearModel(db,validatedDefinition.docType, validatedDefinition.attributes,null);
    return calypearModel;
  }

  all() {
    return this._db.find({
      selector: {
        docType: this.docType
      }
    }).then((dbresponse) => {
      return dbresponse.docs;
    }).catch((err) => {
      //FIXME: do something better with this
      console.log(err);
    })
  }

  find(selector) {
    //FIXME: set this properly - at the moment it won't use indexes properly
    let queryStatement = Object.assign({},{'selector': selector});
    //Push selector to
    queryStatement.selector.docType = this.docType;
    return this._db.find(queryStatement).then((dbresponse) => {
      return dbresponse.docs;
    });
  }

  //Create the document in the datebase
  createSingle(doc) {
    //Validate the document first
    let schema = this.validationSchema;
    //Will throw an error if supplied doc doesn't match schema
    //FIXME:P1 - This just errors out - need to wrap this in handling
    let validated = Joi.attempt(doc,schema);
    //FIXME: Should we create a document object first to implement functions?

    //TODO: Clean this up - this copy is now no longer needed
    let validDoc = Object.assign({}, validated,{
      docType: this.docType,
      //_rev: null
    });

    //FIXME: Handle errors better here
    let dbpromise;
    //If an ID is supplied use that instead of generating one
    if (validDoc._id) {
      dbpromise = this._db.put(validDoc);
    } else {
      dbpromise = this._db.post(validDoc);
    }
    //Mix the response back in with the validated doc and return the lot to the requester
    return dbpromise.then((dbresponse) => {
      return Object.assign({}, validDoc,{
        _id : dbresponse.id,
        _rev: dbresponse.rev
      });
    });
    //FIXME: Handle this and return a better error;
  }

  //Create multiple documents
  //FIXME: Add transactional support to rollback when there's a failure
  create(docs) {

    if (Array.isArray(docs)) {
      //Doesn't use Pouch's bulkDocs as this doesn't support transactions either
      let promiseArray = docs.map((currDoc) => {
        return this.createSingle(currDoc);
      });

      return Promise.all(promiseArray).then((responses) => {
        //arguments should actually be all the response objects so we can combine them
        console.log(responses);
        return responses;
      });
    } else {
      return this.createSingle(docs);
    }


  }

  //Get a document purely by its ID
  get(docId) {

    return this._db.get(docId).then((dbresponse) => {
      //FIXME: Check the document is of the correct type
      //FIXME: Validate the document here - the documents don't validate themselves
      return dbresponse;
    });
    // .catch((err) => {
    //   //FIXME: What to do if we get here?
    //   return err;
    // });
  }

  update(docId, changeAttributes) {
    //FIXME: we don't actually need to handle the catch statements as this is only a very thin wrapper around PouchDB
    //Retrieve the referenced document
    //FIXME: Should actually check if _rev is being supplied, to check if the object we are updating is actually the same as it was when we looked at it
    return this.get(docId).then((dbDoc) => {
      console.log(dbDoc);
      //Copy the object and alter the properties
      //Force DocType to match this model
      //Don't need to set _id or _rev as these are already supplied
      //FIXME: _id and _revId could be overwritten here - prevent this
      let updateObj = Object.assign({},dbDoc,changeAttributes,{
        docType: this.docType,
      });
      //Validate the document first
      let validated = Joi.validate(updateObj,this.validationSchema);
      //save back to the Database
      //doc._rev should already be setup - otherwise this should fail anyway
      //Return the same as create to the caller
      return this.create(updateObj);

    });
  }

  destroySingle(docId) {
    //Get the document first (to get the revId)
    return this.get(docId).then((dbDoc) => {
      //remove it
      return this._db.remove(dbDoc).then((dbresponse) => {
        return dbresponse;
      });
    });
  }

  destroy(docIds) {
    if (Array.isArray(docIds)) {
      //Doesn't use Pouch's bulkDocs as this doesn't support transactions either
      let promiseArray = docIds.map((currDocId) => {
        return this.destroySingle(currDocId);
      });

      return Promise.all(promiseArray).then((responses) => {
        return responses;
      });
    } else {
      return this.destroySingle(docIds);
    }
  }

  get docType(){
    return this._docType;
  }

  set docType(docType) {
    this._docType = docType;
  }



  //Get the underlying Pouch DB instance
  get pouchDB() {
    return this._db
  }

  get validationSchema(){
    return Joi.object().keys(this._attributesDef);
  }
}

module.exports = CalypearModel;
