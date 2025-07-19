const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('directors', {
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
    tableName: 'directors',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "directors_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
