'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      overview: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      vote_average: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 10
        }
      },
      poster_path: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      backdrop_path: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      release_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      runtime: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1
        }
      },
      popularity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      admin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('movies');
  }
};