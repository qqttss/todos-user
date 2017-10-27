'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const configInfo = require('./../configuration/config');

const Schema = mongoose.Schema;

//  Define the user schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens:[{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email', 'password']);
};

userSchema.statics.findByToken = function(token, callback) {
  var UserClass = this;
  var decoded = {};

  try {
    decoded = jwt.verify(token, configInfo.JWT_SECRET);
  } catch (verifyErr) {
    callback(verifyErr);
  }

  return UserClass.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  }, function(userErr, user) {
    if (userErr) {
      callback(null, userErr);
    }

    callback(null, null, user);
  });
};

userSchema.methods.generateAuthToken = function(callback) {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access: access }, configInfo.JWT_SECRET).toString();

  user.tokens.push({ access: access, token: token });

  return user.save(function(err, user) {
    if (err) {
      return callback(err);
    }

    callback(null, user);
  });

};

userSchema.methods.removeToken = function(token, callback) {
  var user = this;

  user.update({ $pull: { tokens: { token: token} } }, function(err, raw) {
    if (err) {
      callback(err);
    }

    callback(null, raw);
  });
};

userSchema.statics.findByCredentials = function(email, password, callback) {
  var User = this;

  User.findOne({ email: email }, function(findErr, user) {
    if (findErr) {
      callback(findErr);
    }

    bcrypt.compare(password, user.password, function(compareErr, res) {
      if (compareErr) {
        callback(null, compareErr);
      }

      callback(null, null, user);
    });
  });
};

userSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    // hashing user password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//  create the user model class
const User = mongoose.model('User', userSchema);

//  export the user model
module.exports = User;
