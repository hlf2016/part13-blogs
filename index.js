const express = require('express')
const app = express()
// 要在 routers 之前引入
require('express-async-errors')
const { errorHandler } = require('./util/middleware')
const { fn, col } = require('sequelize')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const readingListRouter = require('./controllers/readingList')

const { Blog } = require('./models')

// 将 post 提交的数据存放入 req.body 中
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use('/api/readinglists', readingListRouter)

app.get('/api/authors', async (req, res) => {
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

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()





