const Sequelize = require('sequelize');
let CurrencyModel = function (sequelize) {
  let Currency = sequelize.define('Currency', {
    ID: {
      // primary key
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    DisplayName: {
      // 显示名称(like: Dollar)
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ExchangeRate: {
      // 汇率(like: RMB/Dollar 0.1511)
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false,
      unique: false,
    }
  }, {
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  return Currency;
}

module.exports = CurrencyModel;