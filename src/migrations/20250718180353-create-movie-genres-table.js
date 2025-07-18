'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('movie_genres', {
      movie_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'movies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      genre_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'genres',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('movie_genres');
  }
};