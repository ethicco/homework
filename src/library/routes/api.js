const express = require('express');
const uuid = require('uuid');
const multer = require('../middleware/file');
const { store } = require('./index');
const redisClient = require('../libs/redis-client');

const routerApi = express.Router();

class Book {
  constructor(
    title = '',
    description = '',
    authors = '',
    favorite = false,
    fileCover = '',
    fileName = '',
    fileBook = '',
    id = uuid.v4()
  ){
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover,
    this.fileName = fileName;
    this.fileBook = fileBook;
    this.id = id;
  }
}

routerApi.post('/user/login', (req, res) => {

  if(!req.body?.email){
    res.status(404)
     res.json('404 | Пользователь не найден')
  }

  res.json({id: 1, mail: req.body.email}).status(201)
});

routerApi.get('/books', (req, res) => {
  const { books } = store;

  res.json(books);
});

routerApi.get('/books/:id', async (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const book = books.find(book => book.id === id);

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

routerApi.post('/books', multer.single('fileBook'), (req, res) => {
  const { books } = store;
  const {  
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  } = req.body

   const newBook = new Book(
    title, 
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook = req?.file?.path,
  );
  books.push(newBook);

  res.status(301);
  res.redirect('/');
});

routerApi.post('/books/:id', (req, res) => {
  const { books } = store;
  const {  
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  } = req.body;
  const { id } = req.params;

  const book = books.find(book => book.id === id);

  if(book){
    const idx = books.findIndex(book => book.id === id)
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    }

    res.redirect('/')
  } else {
    res.status(404)
    res.redirect('/404')
  }
});

routerApi.delete('/books/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const idx = books.findIndex(book => book.id === id);
    
  if(idx !== -1){
    books.splice(idx, 1);
    res.redirect('/');
  } else {
    res.status(404);
    res.redirect('/404')
  }
});

routerApi.get('/books/:id/download', (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const book = books.find(book => book.id === id);

  if(book){
    res.download(book.fileBook, (err) => {
      if(err){
        console.error(err)
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