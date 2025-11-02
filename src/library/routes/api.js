const express = require('express');
const passport = require('../libs/passport')


const multer = require('../middleware/file');
const redisClient = require('../libs/redis-client');
const BookModel = require('../models/book');
const UserModel = require('../models/user')

const routerApi = express.Router();


routerApi.get('/user/login', (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
     isRegistration: false
  })
});

routerApi.get('/user/signup', (req, res) => {
  res.render('auth/login', {
    title: 'Регистрация',
    isRegistration: true
  })
})

routerApi.get(
  '/user/me', 
  (req, res, next) => {
    if(!req.isAuthenticated()) {
      return res.redirect('/api/user/login');
    }

    next()
  }, 
  (req, res) => {
    res.render('auth/profile', {
      user: req.user
    })
  }
);

routerApi.post(
  '/user/login', 
  passport.authenticate('local', { failureRedirect: '/' }), 
  (req, res) => {
    res.redirect('/')
  }
);

routerApi.post('/user/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = new UserModel({ username, password });

  await user.save();

  res.redirect('/api/user/login');
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