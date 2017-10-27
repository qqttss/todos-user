'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  text: {
    type: String,
    required: 'kindly enter the text of the task'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports  = mongoose.model('Task', TaskSchema);
