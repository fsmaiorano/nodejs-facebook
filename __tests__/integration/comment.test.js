const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../index');

const factory = require('../factories');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

describe('Create Comment', () => {
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

  it('comment not find', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post');
    const jwt = `${user.generateToken()}`;

    await Post.remove();

    const response = await chai.request(app)
      .post(`/api/comment/${post.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });
});

describe('Destroy Comment', () => {
  beforeEach(async () => {
    await Post.remove();
    await User.remove();
  });

  it('it should delete a comment', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post');

    const jwtToken = user.generateToken();

    await chai.request(app)
      .post(`/api/comment/${post.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();

    const response = await chai.request(app)
      .delete(`/api/comment/${post.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();

    expect(response.body.comments).to.not.include(post.id);
  });

  it('comment not found', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post');

    const jwtToken = user.generateToken();

    const response = await chai.request(app)
      .delete(`/api/comment/${post.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });
});
