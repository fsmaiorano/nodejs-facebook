const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = {

  async create(req, res, next) {
    try {
      const post = await Post.create({ ...req.body, user: req.userId });
      return res.json(post);
    } catch (error) {
      return next(error);
    }
  },

  async destroy(req, res, next) {
    try {
      await Post.findByIdAndRemove(req.params.id);
      return res.send();
    } catch (error) {
      return next(error);
    }
  },

};
