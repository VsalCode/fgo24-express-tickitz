const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movie_directors', {
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'movies',
        key: 'id'
      }
    },
    director_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'directors',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'movie_directors',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "movie_directors_pkey",
        unique: true,
        fields: [
          { name: "movie_id" },
          { name: "director_id" },
        ]
      },
    ]
  });
};
