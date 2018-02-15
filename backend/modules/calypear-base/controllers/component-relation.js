const uuid = require('uuid/v4');

module.exports = {
  search: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentRelation = odm.models.componentrelation;
    let selector = {};
    //Find all the relations in a transaction
    if (req.query.transaction) {
      selector.transaction = req.query.transaction;
    }
    //Get only relations from the supplied component
    if (req.query.from) {
      selector.from = req.query.from;
    }
    //Get all relations the component is involved in
    if (req.query.to) {
      selector.to = req.query.to;
    }
    ComponentRelation.find({'selector': selector}).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  //Creates both sides of the transaction on its own
  create: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentRelation = odm.models.componentrelation;
    let transactionId = uuid();
    let relationData = [];
    //Create the primary side
    relationData.push({
      from: req.body.from,
      relationType: req.body.relationType,
      to: req.body.to,
      inverse: false,
      transaction: transactionId
    });
    //Create the inverse side
    relationData.push({
      from: req.body.to,
      relationType: req.body.relationType,
      to: req.body.from,
      inverse: true,
      transaction: transactionId
    });

    ComponentRelation.create(relationData).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  readAllForComponent: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentRelation = odm.models.componentrelation;
    let selector = {
      from: req.params.componentId,
    };

    ComponentRelation.find({selector}).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  update: function(req, res, next) {
    res.sendStatus(500).send('Not Implemented');
  },
  //Deletion is done via the transaction id - removes both sides of the transaction
  destroy: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentRelation = odm.models.componentrelation;

    ComponentRelation.find({
      selector: {
        transaction: req.params.transaction
      }
    }).then((dbresponse) => {
      //If an array isn't return then the transaction is wrong or invalid
      if (Array.isArray(dbresponse)) {
        let docIdsToDelete = dbresponse.map((currDoc) => {
          return currDoc._id;
        })

        ComponentRelation.destroy(docIdsToDelete).then((dbresponse) => {
          res.send(dbresponse);
        }).catch((err) => {
          res.sendStatus(500).send(err);
        });
      } else {
        res.sendStatus(500).send('Invalid Transaction Id');
      }
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500).send(err);
    });
  }
}
