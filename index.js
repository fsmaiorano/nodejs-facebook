const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

require('dotenv').config({ path: envPath });

const app = require('express')();
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const bodyParser = require('body-parser');

const dbConfig = require('./config/database');

mongoose.connect(dbConfig.url);
requireDir(dbConfig.modelsPath); // Load all models

app.use(bodyParser.json());

app.use('/api', require('./app/routes'));

app.listen(3000);

module.exports = app;
