'use strict';

const _ = require('lodash');

const User = require('../models/user');

// app.post('/users')
exports.createAUser = function(req, res, next) {
  var body = _.pick(req.body, ['email', 'password']);

  User.findOne({ email: body.email }, function(err, existingUser) {
    if (err) {
      return res.status(400).send(err);
    }

    // If a user with email dose exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // if a user with email does NOT exist, create and save user record
    var newUser = new User(body);

    newUser.save(function(err, user) {
      if (err) {
        return res.status(400).send(err);
      }

      user.generateAuthToken(function(err, updatedUser) {
        if (err) {
          return next();
        }

        //console.log("Token:\n ", updatedUser.tokens[0].token);
        res.header('x-auth', updatedUser.tokens[0].token).send(updatedUser);
      });

    });

  });

};

//  For app.route('/users/me').post()
exports.accessMyRoute = function(req, res, next) {
  res.send(req.user);
};

// for app.route('/users/login').post()
exports.login = function(req, res, next) {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password, function(finErr, compareErr, user) {
    if (finErr) {
      res.status(400).send();
    }

    if (compareErr) {
      res.status(400).send();
    }

    user.generateAuthToken(function(err, authdUser) {
      if (err) {
        return next();
      }

      res.header('x-auth', authdUser.tokens[0].token).send(authdUser);
    });
  });
};

// for app.route('/users/me/logouy').delete()
exports.logout = (req, res, next) => {
  req.user.removeToken(req.token, function(err, user) {
    if (err) {
      res.status(400).send();
    }

    res.status(200).send();
  });
};
