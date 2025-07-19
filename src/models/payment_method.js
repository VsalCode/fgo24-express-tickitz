const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment_method', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "payment_method_name_key"
    }
  }, {
    sequelize,
    tableName: 'payment_method',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "payment_method_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "payment_method_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
