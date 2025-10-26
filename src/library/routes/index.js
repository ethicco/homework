const express = require('express')

const router = express.Router()

const store = {
  books: []
};

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Главная (Список книг)',
    books: store.books
  })
})

module.exports = {
  router,
  store
}
