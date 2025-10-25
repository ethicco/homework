const uuid = require('uuid');
const express = require('express');

const app = express();

app.use(express.json());


class Book {
  constructor(
    title = '',
    description = '',
    authors = '',
    favorite = '',
    fileCover = '',
    fileName = '',
    id = uuid()
  ){
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover,
    this.fileName = fileName;
    this.id = id
  }
}

const store = {
  books: []
};

app.post('/api/user/login', (req, res) => {

  if(!req.body?.email){
    res.status(404)
     res.json('404 | Пользователь не найден')
  }

  res.json({id: 1, mail: req.body.email}).status(201)
});

app.get('/api/books', (req, res) => {
  const { books } = store;

  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
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

app.post('/api/books', (req, res) => {
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
    fileName
  );
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

app.put('/api/books/:id', (req, res) => {
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
      fileName
    }

    res.json(books[idx]);
  } else {
    res.status(404)
    res.json('404 | страница не найдена')
  }
});

app.delete('/api/books/:id', (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT);