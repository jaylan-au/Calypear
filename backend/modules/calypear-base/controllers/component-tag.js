const uuid = require('uuid/v4');

module.exports = {
  search: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentTag = odm.models.componenttag;
    let selector = {};
    //Find all the relations in a transaction
    if (req.query.component) {
      selector.component = req.query.component;
    }

    ComponentTag.find(selector).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  //Creates both sides of the transaction on its own
  create: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentTag = odm.models.componenttag;
    let componentTagData = {
      component: req.body.component,
      tagType: req.body.tagType,
      value: req.body.value,
    }

    ComponentTag.create(componentTagData).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500).send(err);
    });
  },
  readAllForComponent: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentTag = odm.models.componenttag;
    let selector = {
      component: req.params.componentId,
    };

    ComponentTag.find(selector).then((dbresponse) => {
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
    const ComponentTag = odm.models.componenttag;

    ComponentTag.destroy(req.params.id).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500).send(err);
    });

  }
}
