const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../db/config');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password, {
    host: config.development.host,
    dialect: 'postgres',
    port: config.development.port,
    logging: false 
  }
);

const models = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file !== 'index.js' &&
      file.slice(-3) === '.js' &&
      !file.includes('.test.js')
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models
};