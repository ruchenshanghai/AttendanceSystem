const Sequelize = require('sequelize');
let TargetRateModel = function (sequelize) {
  let TargetRate = sequelize.define('TargetRate', {
    ID: {
      // primary key
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    Detail: {
      type: Sequelize.DataTypes.STRING(1024),
      allowNull: false,
      unique: true,
    }
  }, {
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  return TargetRate;
}

module.exports = TargetRateModel;