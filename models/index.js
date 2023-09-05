const Blog = require('./blog')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const ReadingLists = require('./reading_lists')


User.hasMany(Blog)
Blog.belongsTo(User)


User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(Blog, { through: ReadingLists, as: 'user_readings' })
Blog.belongsToMany(User, { through: ReadingLists, as: 'reading_users' })

// Blog.sync({ alter: false })
// User.sync({ alter: false })

module.exports = {
  Blog,
  User,
  Team,
  Membership,
  ReadingLists
}
