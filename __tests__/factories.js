const mongoose = require('mongoose');
const factoryGirl = require('factory-girl');
const faker = require('faker');

const { factory } = factoryGirl;

factory.setAdapter(new factoryGirl.MongooseAdapter());

// User
factory.define('User', mongoose.model('User'), {
  name: faker.name.findName(),
  username: factory.seq('User.username', x => `user_${x}`),
  email: factory.seq('User.email', x => `user_${x}@email.com`),
  password: faker.internet.password(),
});

factory.define('Post', mongoose.model('Post'), {
  content: faker.lorem.sentence(),
  user: factory.assoc('User', '_id'), // Create user and recover _id
});

module.exports = factory;

