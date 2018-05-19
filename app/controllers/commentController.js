const mongoose = require('mongoose');

const Post = mongoose.model('Post');

module.exports = {

  async create(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).json({ error: 'Comment doesn\'t exist' });
      }

      post.comments.push(req.userId);

      await post.save();

      return res.json(post);

    } catch (error) {
      return next(error);
    }
  },

  async destroy(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);
      let commented = post.comments.indexOf(req.userId);
      if (commented !== -1) {
        post.comments.splice(commented, 1);
        post.save();
      }
      else {
        return res.status(400).json({ error: 'Comment doesn\'t exist' });
      }
      return res.send();
    } catch (error) {
      return next(error);
    }
  },

};
