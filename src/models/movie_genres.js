const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movie_genres', {
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'movies',
        key: 'id'
      }
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'genres',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'movie_genres',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "movie_genres_pkey",
        unique: true,
        fields: [
          { name: "movie_id" },
          { name: "genre_id" },
        ]
      },
    ]
  });
};
