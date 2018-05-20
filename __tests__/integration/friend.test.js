const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../index');
const factory = require('../factories');

const User = mongoose.model('User');

describe('Create Friend', () => {
  beforeEach(async () => {
    await User.remove();
  });

  it('it should be able add a friend', async () => {
    const user1 = await factory.create('User');
    const user1JwtToken = user1.generateToken();

    const user2 = await factory.create('User');

    const response = await chai.request(app)
      .post(`/api/friend/${user2.id}`)
      .set('Authorization', `Bearer ${user1JwtToken}`)
      .send(user1);

    expect(response.body.friends).to.include(user2.id);
  });

  it('it should not find a user with id', async () => {
    const user = await factory.create('User');
    const jwt = `${user.generateToken()}`;

    await User.remove();

    const response = await chai.request(app)
      .post(`/api/friend/${user.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('it should return already friends', async () => {
    const user = await factory.create('User');
    const user2 = await factory.create('User');
    const jwt = `${user.generateToken()}`;

    await chai.request(app)
      .post(`/api/friend/${user2.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    const response = await chai.request(app)
      .post(`/api/friend/${user2.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });


  it('it should be able block add yourself', async () => {
    const user = await factory.create('User');
    const jwt = `${user.generateToken()}`;

    const response = await chai.request(app)
      .post(`/api/friend/${user.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });
});

describe('Destroy Friend', () => {
  beforeEach(async () => {
    await User.remove();
  });

  it('it should be remove a friend', async () => {
    const user = await factory.create('User');
    const user2 = await factory.create('User');
    const jwt = `${user.generateToken()}`;

    const newUser = await chai.request(app)
      .post(`/api/friend/${user2.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    const response = await chai.request(app)
      .del(`/api/removefriend/${newUser.body.friends[0]}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response.body.friends).to.not.include(user.id);
  });

  it('it should not find a user with id', async () => {
    const user = await factory.create('User');
    const jwt = `${user.generateToken()}`;

    await User.remove();

    const response = await chai.request(app)
      .del(`/api/removefriend/${user.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('it should return error of selected user is no your friend', async () => {
    const user1 = await factory.create('User');
    const jwt = user1.generateToken();

    const user2 = await factory.create('User');

    const newUser = await chai.request(app)
      .post(`/api/friend/${user2.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    await chai.request(app)
      .del(`/api/removefriend/${newUser.body.friends[0]}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    const response = await chai.request(app)
      .del(`/api/removefriend/${newUser.body.friends[0]}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();


    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });
});
