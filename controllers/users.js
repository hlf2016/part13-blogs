const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog, Team, ReadingLists } = require('../models')
const { SALT_ROUNDS } = require('../util/config')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      }
    ]
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await User.create({
    username, name, passwordHash
  })
  res.status(201).json(user)
})

router.put('/:username', async (req, res) => {
  const username = req.params.username
  const newUsername = req.body.username
  const user = await User.findOne({
    where: {
      username
    }
  })

  if (!user) return res.status(404).end()
  const newUser = await User.findOne({
    where: {
      username: newUsername
    }
  })
  if (newUser) {
    return res.status(400).json({ error: 'Username Conflicted' })
  }

  user.username = newUsername
  const updatedUser = await user.save()

  res.json(updatedUser)
})

router.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read) {
    where.has_read = req.query.read
  }
  const user = await User.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['username', 'name'],
    include: [
      {
        model: Blog,
        as: 'user_readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['has_read', 'id'],
          where
        }
      }
    ]
  })
  if (!user) {
    return res.status(404).json({ error: 'User Not Found' })
  }
  res.json(user)
})


module.exports = router
