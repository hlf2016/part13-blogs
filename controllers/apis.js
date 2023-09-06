const router = require('express').Router()
const { User, Session, Blog } = require('../models')
const { fn, col } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')


router.get('/authors', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [fn('count', col('id')), 'articles'],
      [fn('sum', col('likes')), 'likes']
    ],
    group: 'author',
    order: [['likes', 'desc']]
  })
  res.json(authors)
})

router.delete('/logout', tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id
  await Session.destroy({
    where: {
      userId
    }
  })
  res.status(204).end()
})

module.exports = router
