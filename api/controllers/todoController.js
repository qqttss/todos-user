'use strict';

const Task = require('../models/todoModel');

//  For app.route('/tasks').get(): get all tasks
exports.getAllTasks = function(req, res) {
  Task.find({ _creator: req.user._id }, function(err, tasks) {
    if (err) {
      return res.status(404).send(err);
    }
    res.send({
      tasks: tasks
    });
  });
};

// For app.route('/tasks').post(): create a new task
exports.createAtask = function(req, res) {
  var newtask = new Task({
    text: req.body.text,
    _creator: req.user._id
  });

  newtask.save(function(err, task) {
    if (err) {
      return res.status(404).send(err);
    }
    res.send(task);
  });
};

// app.route('/tasks/:id'): get an individual task
exports.getATask = function(req, res) {
  Task.findOne({ _id: req.params.id, _creator: req.user._id }, function(err, task) {
    if (err) {
      return res.status(404).send(err);
    }
    res.send({
      task: task
    });
  });
};

// app.route('/tasks/:id'):  update an indivudual task
exports.updateATask = function(req, res) {
  //console.log('request body:\n', req.body);
  Task.findOneAndUpdate( { _id: req.params.id, _creator: req.user._id }, { $set: { text: req.body.text } }, { new: true }, function(err, task) {
    if (err)
      return res.status(404).send(err);
    res.send({
      task: task
    });
  });
};

// app.route('/tasks/:id'):  delete an indivudual task
exports.deleteATask = function(req, res) {
  Task.findOneAndUpdate({
    _id: req.params.id,
    _creator: req.user._id
  }, function(err, task) {
    if (err) {
      return res.status(404).send(err);
    }
    res.send({ message: 'Task has been successfully deleted' });
  });
};
