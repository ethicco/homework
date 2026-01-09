import { Router } from 'express';
import container from '../container';
import BooksRepository from '../repositories/books-repository';

const routerBooks = Router();

routerBooks.get(':id', async (req, res) => {
  const repo = container.get(BooksRepository);
  const book = await repo.getBook(req.params.id);

  if(!book) {
    return res.status(404).json({
      status: 404,
      message: 'Book not found'
    })
  }

  return res.json(book);
})