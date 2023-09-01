const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model { }

Model.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING(100),
  },
  url: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // 跟 ./index.js 中 Blog.belongsTo(User) 一样的效果 无非是定义看着更加明显些
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: { model: 'users', key: 'id' }
  // }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

module.exports = Blog
