const express = require('express');
const multer = require('../middleware/file');
const redisClient = require('../libs/redis-client');
const BookModel = require('../models/book');

const routerApi = express.Router();

routerApi.post('/user/login', (req, res) => {

  if(!req.body?.email){
    res.status(404)
     res.json('404 | Пользователь не найден')
  }

  res.json({id: 1, mail: req.body.email}).status(201)
});

routerApi.get('/books', async (req, res) => {
  const books = await BookModel.find()
console.log(books)
  res.json(books);
});

routerApi.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  const book = await BookModel.findById(id);

  if(book){
    try {
      const cnt = await redisClient.incr(book.title)
      res.json({book, cnt}); 
    } catch (error) {
      res.json({errCode: 500, errMessage: `Redis error ${error}!`})
    }
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

routerApi.post('/books', multer.single('fileBook'), async (req, res) => {
  const {  
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  } = req.body

  const newBook = new BookModel({
    title, 
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook: req?.file?.path,
  })
   
  await newBook.save()

  res.status(301);
  res.redirect('/');
});

routerApi.post('/books/:id', async (req, res) => {
  const {  
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  } = req.body;
  const { id } = req.params;

  await BookModel.updateOne({
    _id: id
  }, 
  { $set: {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  }})
    
  res.redirect('/')
});

routerApi.delete('/books/:id', async (req, res) => {
  const { id } = req.params;

  await BookModel.deleteOne({ id })    
  
  res.redirect('/');
});

routerApi.get('/books/:id/download', (req, res) => {
  const { id } = req.params;

  const book = BookModel.findOne({ id });

  if(book){
    res.download(book.fileBook, (err) => {
      if(err){
        console.error(err);
        res.status(500).json({ message: 'Ошибка при скачивании файла' })
      }
    })
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
})

routerApi.post('/counter/:bookId/incr', async (req, res) => {
  const { bookId } = req.params;

  try {
    const cnt = await redisClient.incr(bookId);
    res.json({bookId, cnt}); 
  } catch (error) {
    res.json({errCode: 500, errMessage: `Redis error ${error}!`})
  }
})

routerApi.get('/counter/:bookId', async (req, res) => {
  const { bookId } = req.params;
  
  try {
    const cnt = await redisClient.get(bookId);
    res.json({bookId, cnt}); 
  } catch (error) {
    res.json({errCode: 500, errMessage: `Redis error ${error}!`})
  }
})

module.exports = routerApi