'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('movie_directors', {
      movie_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'movies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      director_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'directors',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('movie_directors');
  }
};