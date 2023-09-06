const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { tokenExtractor, blogFinder } = require('../util/middleware')

router.get('/', async (req, res) => {
  where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  }
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: [
      {
        model: User,
        attributes: ['name', 'id']
      }
    ],
    order: [
      ['likes', 'desc']
    ],
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id
  const user = await User.findByPk(userId)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.json(blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'user_id not match' })
  }
  if (req.blog) {
    await req.blog.destroy()
  }
  return res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }

})

module.exports = router

