const mongoose = require('mongoose');

const Post = mongoose.model('Post');

module.exports = {

  async create(req, res, next) {
    try {
      console.log(req.body);
      const post = await Post.create({ ...req.body, user: req.userId });
      return res.json(post);
    } catch (error) {
      /* istanbul ignore next */
      return next(error);
    }
  },

  async destroy(req, res, next) {
    try {
      await Post.findByIdAndRemove(req.params.id);
      /* istanbul ignore next */
      return res.send();
    } catch (error) {
      /* istanbul ignore next */
      return next(error);
    }
  },

};
