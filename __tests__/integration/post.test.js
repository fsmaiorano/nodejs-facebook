const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../index');
const factory = require('../factories');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

describe('Create Post', () => {
  beforeEach(async () => {
    await User.remove();
    await Post.remove();
  });

  it('it should create a new post', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();
    const response = await chai.request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ content: 'Criar Post' });
    expect(response.body).to.include({ content: 'Criar Post' });
  });
});

describe('Destroy Post', () => {
  it('it should delete a post', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();
    const response = await chai.request(app)
      .del('/api/posts')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ content: 'Criar Post' });
    expect(response.body).to.be.empty;
  });
});
