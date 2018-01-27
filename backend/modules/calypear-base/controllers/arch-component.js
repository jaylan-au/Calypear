module.exports = {
  search: function(req, res, next) {
    const odm = req.app.get('odm');
    const ArchComponent = odm.models.archcomponent;
    ArchComponent.all().then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  create: function(req, res, next) {
    const odm = req.app.get('odm');
    const ArchComponent = odm.models.archcomponent;
    ArchComponent.create(req.body).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  read: function(req, res, next) {
    const odm = req.app.get('odm');
    const ArchComponent = odm.models.archcomponent;
    ArchComponent.get(req.params.componentId).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  update: function(req, res, next) {
    const odm = req.app.get('odm');
    const ArchComponent = odm.models.archcomponent;
    let updateParams = req.body;
    ArchComponent.update(req.params.componentId,updateParams).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  delete: function(req, res, next) {
    const odm = req.app.get('odm');
    const ArchComponent = odm.models.archcomponent;
    ArchComponent.delete(req.params.componentId).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  }
}
