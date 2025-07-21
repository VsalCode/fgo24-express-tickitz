// const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Genres = sequelize.define('genres', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "genres_name_key"
    }
  }, {
    sequelize,
    tableName: 'genres',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "genres_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "genres_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  Genres.associate = function(models) {
    Genres.belongsToMany(models.movies, {
      through: models.movie_genres,
      foreignKey: 'genre_id',
      otherKey: 'movie_id'
    });
  };

  return Genres;
};
