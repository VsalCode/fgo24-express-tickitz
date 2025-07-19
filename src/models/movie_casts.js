const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('movie_casts', {
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'movies',
        key: 'id'
      }
    },
    cast_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'casts',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'movie_casts',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "movie_casts_pkey",
        unique: true,
        fields: [
          { name: "movie_id" },
          { name: "cast_id" },
        ]
      },
    ]
  });
};
