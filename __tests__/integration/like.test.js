const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../index');
const factory = require('../factories');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

describe('Like', () => {
  beforeEach(async () => {
    await User.remove();
    await Post.remove();
  });

  it('it should be able to like a post', async () => {
    const post = await factory.create('Post');

    const user = await factory.create('User');
    const jwtToken = user.generateToken();

    const response = await chai.request(app)
      .post(`/api/like/${post.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();
    expect(response.body.likes).to.include(user.id);
  });
  it('it should not be able to like a none existent post', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();

    const response = await chai.request(app)
      .post('/api/like/321321312312')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });
  it('it should be toggle like a post', async () => {
    const post = await factory.create('Post');

    const user = await factory.create('User');

    const jwtToken = user.generateToken();

    await chai.request(app)
      .post(`/api/like/${post.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(user);

    const toggleResponse = await chai.request(app)
      .post(`/api/like/${post.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(user);

    expect(toggleResponse.body.likes).to.not.include(user.id);
  });
});
