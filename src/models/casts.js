// const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Casts = sequelize.define('casts', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'casts',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "casts_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  Casts.associate = function(models) {
    Casts.belongsToMany(models.movies, {
      through: models.movie_casts,
      foreignKey: 'cast_id',
      otherKey: 'movie_id'
    });
  };

  return Casts;
};
