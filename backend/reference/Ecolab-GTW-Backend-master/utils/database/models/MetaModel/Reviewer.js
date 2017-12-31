const Sequelize = require('sequelize');
let ReviewerModel = function (sequelize) {
  let Reviewer = sequelize.define('Reviewer', {
    ID: {
      // primary key
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    DomainName: {
      // 域认证用户名(like: GLOBAL\XXX)
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    DisplayName: {
      // 用户名(like: Bill Gates)
      type: Sequelize.DataTypes.STRING,
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
  return Reviewer;
}

module.exports = ReviewerModel;