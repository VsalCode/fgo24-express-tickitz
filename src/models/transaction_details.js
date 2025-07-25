const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const TransactionDetails = sequelize.define('transaction_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    seat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'transactions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'transaction_details',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "transaction_details_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  TransactionDetails.associate = (models) => {
    TransactionDetails.belongsTo(models.transactions, {
      foreignKey: 'transaction_id',
      as: 'transaction'
    });
  };

  return TransactionDetails;
};
