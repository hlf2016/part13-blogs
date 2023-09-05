const router = require('express').Router()
const { ReadingLists } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', tokenExtractor, async (req, res) => {
  const existReadingItem = await ReadingLists.findOne({
    where: {
      blogId: req.body.blogId,
      userId: req.decodedToken.id
    }
  })
  if (existReadingItem) {
    return res.status(400).json({ error: 'You had added this item to your reading list' })
  }
  const readingItem = await ReadingLists.create({
    blogId: req.body.blogId,
    userId: req.decodedToken.id
  })
  res.json(readingItem)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingItem = await ReadingLists.findOne({
    where: {
      id: req.params.id,
    }
  })
  if (!readingItem) {
    return res.status(404).json({ error: 'Reading Item Not Found' })
  }
  if (readingItem.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'Unauthorized Request' })
  }
  readingItem.hasRead = true
  const changedReadingItem = await readingItem.save()
  res.json(changedReadingItem)
})

module.exports = router
