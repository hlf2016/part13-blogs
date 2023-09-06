const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../util/config')

const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (req, res) => {
  const body = req.body
  const user = await User.findOne({
    where: {
      username: body.username
    }
  })
  const passwordMatch = await bcrypt.compare(body.password, user.passwordHash)
  if (!(user && passwordMatch)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled , please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, JWT_SECRET)

  await Session.create({
    userId: user.id,
    token: token
  })

  res.json({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = router
