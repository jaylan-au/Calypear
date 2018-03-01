module.exports = function(req, res, next) {
  if(req.isAuthenticated()){
    //if user is looged in, req.isAuthenticated() will return true
    next();
  } else{
    //not authenticated leave it to the UI to handle this
    res.sendStatus(401);
  }
}
