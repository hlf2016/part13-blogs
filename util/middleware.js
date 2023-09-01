const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../util/config')
const { Blog } = require('../models/index')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), JWT_SECRET)
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

const errorHandler = (error, request, response, next) => {
  const { name, errors } = error
  if (name === 'SequelizeValidationError') {
    const errorMsgs = errors.map(error => error.message)
    return response.status(400).json({ error: errorMsgs })
  }
  return response.status(400).json({ error })
  // next(error)
}

module.exports = {
  tokenExtractor,
  blogFinder,
  errorHandler
}
