const express = require('express');
const BookModel = require('../models/book');

const router = express.Router()

router.get(
  '/', 
  async (req, res) => {   
    if(req.user) {
      const books = await BookModel.find();

      res.render('index', {
        title: 'Главная (Список книг)',
        books
      })
    } else {
      res.render('auth/home', {
        title: 'Главная страница (Авторизация)'
      })
    }
  }
)

module.exports = {
  router
}
