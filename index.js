const express = require('express')
const app = express()
// 要在 routers 之前引入
require('express-async-errors')
const { errorHandler } = require('./util/middleware')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const readingListRouter = require('./controllers/readingList')
const apisRouter = require('./controllers/apis')

// 将 post 提交的数据存放入 req.body 中
app.use(express.json())

app.use('/api', apisRouter)

app.use('/api/blogs', blogsRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use('/api/readinglists', readingListRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()





