const { Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('../util/db')
const Blog = require('./blog')

class User extends Model {
  // js class 中添加新的方法
  // 直接获取 用户 博客数量的方法
  // const jami = await User.findOne({ name: 'Jami Kousa'})
  // const cnt = await jami.number_of_notes()
  // console.log(`Jami has created ${cnt} notes`)
  async number_of_blogs() {
    return (await this.getBlogs()).length
  }
  // 静态方法 
  // 筛选具有指定数量博客的用户的方法 
  // const users = await User.with_notes(2)
  // console.log(JSON.stringify(users, null, 2))
  // users.forEach(u => {
  //   console.log(u.name)
  // })
  static async with_blogs(limit) {
    return await User.findAll({
      attributes: {
        include: [[sequelize.fn('COUNT', sequelize.col('blogs.id')), 'blog_count']]
      },
      include: [
        {
          model: Blog,
          attributes: []
        }
      ],
      group: ['user.id'],
      having: sequelize.literal(`COUNT(blogs.id) > ${limit}`)
    })
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user',
  // 默认不显示 disabled=true 的用户
  defaultScope: {
    where: {
      disabled: false
    }
  },
  // 另外预设集中 scope 规则
  scopes: {
    // 查询所有管理员
    // 使用
    // const adminUsers = await User.scope('admin').findAll()
    admin: {
      where: {
        admin: true
      }
    },
    // 查询所有 被封禁 用户
    // 使用 const disabledUsers = await User.scope('disabled').findAll()
    disabled: {
      where: {
        disabled: true
      }
    },
    // 名字中包含 value 字符串的用户
    // const jamiUsers = User.scope({ method: ['name', '%jami%'] }).findAll()
    // 链式操作 名字中包含 value 字符串的管理员
    // const jamiUsers = User.scope('admin', { method: ['name', '%jami%'] }).findAll()
    name(value) {
      return {
        where: {
          name: {
            [Op.iLike]: value
          }
        }
      }
    }
  }
})

module.exports = User
