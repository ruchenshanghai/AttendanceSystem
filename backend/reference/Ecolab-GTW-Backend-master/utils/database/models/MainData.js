const Sequelize = require('sequelize');
let MainDataModel = function (sequelize) {
  let MainData = sequelize.define('MainData', {
    ID: {
      // primary key
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    Reviewer: {
      // Bill Gates, reference form meta table: Reviewer
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    BUDistrict: {
      // 中区
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    OpportunityCode: {
      // 6000-20170829-3
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Province: {
      // 四川省
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    City: {
      // 泸州市
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    Site: {
      // 叙永县
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    ChineseName: {
      // 贵州仁怀茅台大酒店
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    EnglishName: {
      // Guizhou Renhuai Maotai Hotel
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    PipelineStatus: {
      // >90Days, reference form meta table: PipelineStatus
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    ContractTerm: {
      // 1年, reference form meta table: ContractTerm
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    TargetRate: {
      // 不确定, reference form meta table: TargetRate
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    AnnualSales: {
      // 1560000
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    Currency: {
      // 美元
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    CorporateChineseName: {
      // 集团客户中文名
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    CorporateEnglishName: {
      // 集团客户英文名->EnglishName
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    SalesRep: {
      // 销售代表, like: Fayou Li （李法友） (20202587)
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    AssistCAM: {
      // 所协助AssistCAM姓名, reference form meta table: AssistCAM
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    FollowingStatus: {
      // 进展状态FollowingStatus, reference form meta table: FollowingStatus
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    CTCBU: {
      // CTC业务部, reference form meta table: CTCBU
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    CTCSales: {
      // CTC销售负责人, reference form meta table: CTCSales
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    SalesType: {
      // SalesType销售类型, reference form meta table: SalesType
      // format: JSON
      type: Sequelize.DataTypes.STRING(1024),
      allowNull: false,
      unique: false
    },
    FollowingStatusRemark: {
      // FollowingStatusRemark, 进展状态备注
      type: Sequelize.DataTypes.STRING(1024),
      allowNull: true,
      unique: false
    },
    CompetitorCN: {
      // CompetitorCN本地竞争对手, reference form meta table: CompetitorCN
      // format: JSON
      type: Sequelize.DataTypes.STRING(1024),
      allowNull: false,
      unique: false
    },
    FirstCollaborationDate: {
      // FirstCollaborationDate最早合作日期
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: true,
      unique: false
    },
    EstimatedPCO: {
      // EstimatedPCO, 艺康可能占客户PCO比例
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    Remark: {
      // Remark备注
      type: Sequelize.DataTypes.STRING(1024),
      allowNull: true,
      unique: false
    },
    MarketClassification: {
      // MarketClassification市场分类, reference form meta table: MarketClassification
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    ServiceTimeRequested: {
      // ServiceTimeRequested要求服务的时间, format: HHMM-HHMM
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    ModifyRemark: {
      // ModifyRemark记录修改备注
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    RecordOwner: {
      // RecordOwner记录保有者, DomainName
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    CheckedUsers: {
      // 记录查看者集合, DomainName JSON array
      type: Sequelize.DataTypes.STRING(1024),
      allowNull: false,
      unique: false
    },
    UpdateDate: {
      // 更新日期, xxxx-xx-xx
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: false,
      unique: false
    },
    UpdateUser: {
      // 最后更新用户, GLOBAL\XXX
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  }, {
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  return MainData;
}

module.exports = MainDataModel;
