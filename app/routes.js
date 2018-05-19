const express = require('express');
const requireDir = require('require-dir');

const routes = express.Router();
const controllers = requireDir('./controllers');

const authMiddleware = require('./middlewares/auth');

// Auth
routes.post('/signup', controllers.authController.signup);
routes.post('/signin', controllers.authController.signin);

// Auth Routes
routes.use(authMiddleware);

// // Users
// routes.get('/users/me', controllers.userController.me);
// routes.put('/users', controllers.userController.update);
// routes.get('/feed', controllers.userController.feed);

// Post
routes.post('/posts', controllers.postController.create);
routes.delete('/posts/:id', controllers.postController.destroy);

// // Friends
routes.post('/friend/:id', controllers.friendController.create);
routes.delete('/removefriend/:id', controllers.friendController.destroy);

// Like
routes.post('/like/:id', controllers.likeController.toggle);

// Comment
routes.post('/comment/:id', controllers.commentController.create);
routes.delete('/comment/:id', controllers.commentController.destroy);

module.exports = routes;
