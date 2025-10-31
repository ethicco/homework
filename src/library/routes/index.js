const express = require('express')
const BookModel = require('../models/book')

const router = express.Router()

router.get('/', async (req, res) => {
  const books = await BookModel.find();

  res.render('index', {
    title: 'Главная (Список книг)',
    books
  })
})

module.exports = {
  router
}
