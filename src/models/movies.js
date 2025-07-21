// const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Movies = sequelize.define('movies', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vote_average: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    poster_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    backdrop_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    runtime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    popularity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'movies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "movies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  Movies.associate = function(models) {
    Movies.belongsToMany(models.genres, {
      through: models.movie_genres,
      foreignKey: 'movie_id',
      otherKey: 'genre_id'
    });
    
    Movies.belongsToMany(models.directors, {
      through: models.movie_directors,
      foreignKey: 'movie_id',
      otherKey: 'director_id'
    });
    
    Movies.belongsToMany(models.casts, {
      through: models.movie_casts,
      foreignKey: 'movie_id',
      otherKey: 'cast_id'
    });
    
    Movies.belongsTo(models.users, {
      foreignKey: 'admin_id',
      as: 'admin'
    });
  };

  return Movies;
};
