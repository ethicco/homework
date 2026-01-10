import { Router } from 'express';

import { passport, redis } from '../libs';
import { multerMiddleware } from '../middleware';
import container from '../container';
import { BooksRepository, UsersRepository } from '../repositories';

const routerApi = Router();
const usersRepo = container.get(UsersRepository);
const booksRepo = container.get(BooksRepository);


routerApi.get('/user/login', (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
     isRegistration: false
  });
});

routerApi.get('/user/signup', (req, res) => {
  res.render('auth/login', {
    title: 'Регистрация',
    isRegistration: true
  });
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
    });
  }
);

routerApi.post(
  '/user/login', 
  passport.authenticate('local', { failureRedirect: '/' }), 
  (req, res) => {
    res.redirect('/');
  }
);

routerApi.post('/user/signup', async (req, res) => {
  const { username, password } = req.body;
 
  await usersRepo.createUser({ username, password });

  res.redirect('/api/user/login');
});

routerApi.get('/books', async (_req, res) => {
  const books = await booksRepo.getBooks();

  res.json(books);
});

routerApi.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  const book = await booksRepo.getBook(id);

  if(book){
    try {
      const cnt = await redis.incr(book.title);
      res.json({book, cnt}); 
    } catch (error) {
      res.json({errCode: 500, errMessage: `Redis error ${error}!`});
    }
  } else {
    res.status(404);
    res.json('404 | страница не найдена');
  }
});

routerApi.post('/books', multerMiddleware.single('fileBook'), async (req, res) => {
  const {  
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  } = req.body
   
  await booksRepo.createBook({
    title, 
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook: req?.file?.path,
  })

  res.status(301).redirect('/');
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

  await booksRepo.updateBook(id, {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
  })
    
  res.status(301).redirect('/');
});

routerApi.delete('/books/:id', async (req, res) => {
  const { id } = req.params;

  await booksRepo.deleteBook(id);    
  
  res.redirect('/');
});

routerApi.get('/books/:id/download', async (req, res) => {
  const { id } = req.params;

  const book = await booksRepo.getBook(id);

  if(book){
    res.download(book.fileBook, (err) => {
      if(err){
        console.error(err);
        res.status(500).json({ message: 'Ошибка при скачивании файла' });
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
    const cnt = await redis.incr(bookId);
    res.json({bookId, cnt}); 
  } catch (error) {
    res.json({errCode: 500, errMessage: `Redis error ${error}!`})
  }
})

routerApi.get('/counter/:bookId', async (req, res) => {
  const { bookId } = req.params;
  
  try {
    const cnt = await redis.get(bookId);
    res.json({bookId, cnt}); 
  } catch (error) {
    res.json({errCode: 500, errMessage: `Redis error ${error}!`})
  }
})

export default routerApi;
