'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const configInfo = require('./api/configuration/config');
const app = express();

const routes = require('./api/routes/routes');

//DB setup and connection
mongoose.Promise = global.Promise;
mongoose.connect(configInfo.MONGODB_URL);

// app setup
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);

// server setup
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server is up on: ' + port);
