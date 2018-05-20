const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../index');

const factory = require('../factories');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

describe('Comment', () => {
  beforeEach(async () => {
    await Post.remove();
    await User.remove();
  });

  it('should be able to comment a post', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post');

    const jwtToken = user.generateToken();

    const response = await chai.request(app)
      .post(`/api/comment/${post.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(user);

    expect(response.body.comments).to.include(user.id);
  });

  // it('post not find', async () => {
  //   const user = await factory.create('User');
  //   const post = await factory.create('Post');

  //   const jwtToken = user.generateToken();

  //   const response = await chai.request(app)
  //     .post('/api/comment/32321321321')
  //     .set('Authorization', `Bearer ${jwtToken}`)
  //     .send();

  //   expect(response).to.have.status(400);
  //   expect(response.body).to.have.property('error');
  // });
});
