module.exports = {
  search: function(req, res, next) {
    const odm = req.app.get('odm');
    const ArchComponent = odm.models.archcomponent;

    let querySelector = {}
    if (req.query.name) {
      querySelector.componentName = {
        $regex: new RegExp(req.query.name,'gi')
      };
    }
    ArchComponent.find({'selector': querySelector}).then((dbresponse) => {
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
    const ComponentRelation = odm.models.componentrelation;
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
      console.log(err);
      res.sendStatus(500).send(err);
    });
  },
  destroy: function(req, res, next) {
    const odm = req.app.get('odm');
    const ArchComponent = odm.models.archcomponent;
    ArchComponent.destroy(req.params.componentId).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  }
}
