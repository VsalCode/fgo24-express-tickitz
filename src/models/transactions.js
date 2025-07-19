const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    customer_fullname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    customer_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    cinema: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    show_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    show_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'movies',
        key: 'id'
      }
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'payment_method',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'transactions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "transactions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
