'use strict';

module.exports = function(app) {
  const todoList = require('../controllers/todoController');
  const userCtrl = require('../controllers/userController');
  const authenticate = require('./../middleware/authenticate');

  // handle todo(s) routes
  app.route('/tasks')
    .get(authenticate, todoList.getAllTasks)
    .post(authenticate, todoList.createAtask);

  // handel individual task with its id
  app.route('/tasks/:id')
    .get(authenticate, todoList.getATask)
    .patch(authenticate, todoList.updateATask)
    .delete(authenticate, todoList.deleteATask);

  // Create new user
  app.route('/users')
    .post(userCtrl.createAUser);

  // private route
  app.route('/users/me')
    .post(authenticate, userCtrl.accessMyRoute);

  //  User login
  app.route('/users/login')
    .post(userCtrl.login);

  // User logout
  app.route('/users/me/logout')
    .delete(authenticate, userCtrl.logout);
};
