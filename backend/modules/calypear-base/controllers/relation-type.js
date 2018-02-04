module.exports = {
  all: function(req, res, next) {
    const odm = req.app.get('odm');
    const RelationType = odm.models.relationtype;
    RelationType.all().then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  create: function(req, res, next) {
    const odm = req.app.get('odm');
    const RelationType = odm.models.relationtype;
    RelationType.create({
      typeName: req.body.typeName,
      typeNameInverse: req.body.typeNameInverse,
    }).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  read: function(req, res, next) {

  },
  update: function(req, res, next) {
    const odm = req.app.get('odm');
    const RelationType = odm.models.relationtype;
    RelationType.update(req.params.typeId,{
      typeName: req.body.typeName,
      typeNameInverse: req.body.typeNameInverse,
    }).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  destroy: function(req, res, next) {
    const odm = req.app.get('odm');
    const RelationType = odm.models.relationtype;
    RelationType.destroy(req.params.typeId).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  }
}
