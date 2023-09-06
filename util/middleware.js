const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../util/config')
const { Blog, Session, User } = require('../models/index')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, JWT_SECRET)
      console.log(decodedToken)
      const user = await User.findOne({
        where: {
          id: decodedToken.id
        }
      })
      if (!user || user.disabled) {
        return res.status(401).json({
          error: 'account disabled , please contact admin'
        })
      }
      const session = await Session.findOne({
        where: {
          userId: decodedToken.id,
          token
        }
      })
      if (!session) {
        return res.status(401).json({ error: 'token invalid' })
      }
      req.decodedToken = decodedToken
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'Blog Not Found' })
  }
  req.blog = blog
  next()
}

const errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case 'SequelizeDatabaseError':
      return res.status(400).send({ error: error.message })
    case 'SequelizeValidationError':
      return res
        .status(400)
        .send({ error: error.errors.map((error) => error.message) })
    case 'SequelizeUniqueConstraintError':
      return res.status(400).send({
        error: error.errors.map((error) => error.message),
      })
    default:
      res.status(400).send({ error: error.message })
      break
  }
  next(error)
}

module.exports = {
  tokenExtractor,
  blogFinder,
  errorHandler
}
