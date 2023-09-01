const express = require('express')
const app = express()
// 要在 routers 之前引入
require('express-async-errors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const errorHandler = (error, request, response, next) => {
  console.log(error)
  const { name, errors } = error
  if (name === 'SequelizeValidationError') {
    const errorMsgs = errors.map(error => error.message)
    return response.status(400).json({ error: errorMsgs })
  }
  return response.status(400).json({ error })
  // next(error)
}

// 将 post 提交的数据存放入 req.body 中
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()





