const User = require('./../models/user');

const authenticate = function(req, res, next) {
  var token = req.header('x-auth');

  User.findByToken(token, function(verifyErr, userErr, user) {
    if (verifyErr) {
      res.status(401).send();
    }

    if (userErr) {
      res.status(401).send();
    }

    req.user = user;
    req.token = token;
    next();
  });
};

module.exports = authenticate;
