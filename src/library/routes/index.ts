import { Router } from 'express';
import container from '../container';
import { BooksRepository } from '../repositories';

const router = Router();

const repo = container.get(BooksRepository);

router.get(
  '/', 
  async (req, res) => {  
    if(req.user) {
      const books = await repo.getBooks();

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

export default router
