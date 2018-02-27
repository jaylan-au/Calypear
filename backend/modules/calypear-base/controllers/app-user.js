module.exports = {
  search: function(req,res,next) {
    const odm = req.app.get('odm');
    const AppUser = odm.models.appuser;
    AppUser.find().then((dbresponse) => {

      //Clear the Authentication Field
      dbresponse.forEach((currUser) => {
        if (currUser.authentication) {
          currUser.authentication = '';
        }
      });
      res.send(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  create: function(req, res, next) {
    const odm = req.app.get('odm');
    const AppUser = odm.models.appuser;
    AppUser.createUser(req.body).then((dbresponse) => {
      //Don't send the DB response as normal as this will contain the password
      res.json(Object.assign({},dbresponse,{authentication:''}));
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  },
  read: function(req,res,next) {
    const odm = req.app.get('odm');
    const AppUser = odm.models.appuser;
    AppUser.find({
      selector: {
        username: req.params.username
      }
    }).then((dbresponse) => {
      //Clear the Authentication Field
      dbresponse.forEach((currUser) => {
        if (currUser.authentication) {
          currUser.authentication = '';
        }
      });
      res.json(dbresponse);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  authenticateLogin: function(req,res,next) {
    const odm = req.app.get('odm');
    const AppUser = odm.models.appuser;
    AppUser.find({
      selector: {
        username: 'req.params.username'
      }
    }).then((dbresponse) => {
      if (AppUser.authenticatePassword(dbresponse.data.authentication,req.body.authentication)) {
        res.sendStatus(200);
      } else {
        res.sendStatus(422).send('Invalid Credentials');
      }

    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  updateAuthentication: function(req,res,next) {
    const odm = req.app.get('odm');
    const AppUser = odm.models.appuser;
    AppUser.update(req.params.appUserId,{
      authentication: AppUser.encodePassword(req.body.authentication),
    }).then((dbresponse) => {
      res.sendStatus(200);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  update: function(req,res,next) {
    const odm = req.app.get('odm');
    const AppUser = odm.models.appuser;
    AppUser.update(req.params.appUserId,{
      username: req.body.authentication,
      authentication: AppUser.encodePassword(req.body.authentication),
    }).then((dbresponse) => {
      res.sendStatus(200);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
  delete: function(req, res, next) {
    const odm = req.app.get('odm');
    const AppUser = odm.models.appuser;
    AppUser.destroy(req.params.appUserId).then((dbresponse) => {
      res.sendStatus(200);
    }).catch((err) => {
      res.sendStatus(500).send(err);
    });
  },
}
