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

module.exports = {
  tokenExtractor,
  blogFinder
}
