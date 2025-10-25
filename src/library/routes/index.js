const express = require('express');
const multer = require('../middleware/file')

const routerIndex = express.Router();

class Book {
  constructor(
    title = '',
    description = '',
    authors = '',
    favorite = false,
    fileCover = '',
    fileName = '',
    fileBook = '',
    id = uuid()
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

const store = {
  books: []
};

routerIndex.post('/api/user/login', (req, res) => {

  if(!req.body?.email){
    res.status(404)
     res.json('404 | Пользователь не найден')
  }

  res.json({id: 1, mail: req.body.email}).status(201)
});

routerIndex.get('/api/books', (req, res) => {
  const { books } = store;

  res.json(books);
});

routerIndex.get('/api/books/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const book = books.find(book => book.id === id);

  if(book){
    res.json(book);
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

routerIndex.post('/api/books', multer.single('fileBook'), (req, res) => {
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
    fileBook = req.file.path,
  );
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

routerIndex.put('/api/books/:id', (req, res) => {
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

    res.json(books[idx]);
  } else {
    res.status(404)
    res.json('404 | страница не найдена')
  }
});

routerIndex.delete('/api/books/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;

  const idx = books.findIndex(book => book.id === id);
    
  if(idx !== -1){
    books.splice(idx, 1);
    res.json('ok');
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

routerIndex.get('/api/books/:id/download', (req, res) => {
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

module.exports = routerIndex
