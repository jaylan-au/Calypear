module.exports = {
  all: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentType = odm.models.componenttype;
    ComponentType.all().then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  create: function(req, res, next) {
    const odm = req.app.get('odm');
    const ComponentType = odm.models.componenttype;
    ComponentType.create({
      typeName: req.body.typeName
    }).then((dbresponse) => {
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  read: function(req, res, next) {

  },
  update: function(req, res, next) {

  },
  delete: function(req, res, next) {

  }
}
