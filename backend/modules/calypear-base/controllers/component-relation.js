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

    ComponentRelation.find(selector).then((dbresponse) => {
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
  read: function(req, res, next) {
    res.sendStatus(500).send('Not Implemented');
  },
  update: function(req, res, next) {
    res.sendStatus(500).send('Not Implemented');
  },
  //Deletion is done via the transaction id - which
  destroy: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentRelation = odm.models.componentrelation;


    ComponentRelation.destory(req.params.transaction).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  }
}
