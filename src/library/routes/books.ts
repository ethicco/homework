import { Router } from 'express';

import container from '../container';
import BooksRepository from '../repositories/books-repository';;

const routerBooks = Router();
const repo = container.get(BooksRepository);

routerBooks.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Book | create",
        book: {},
    });
});

routerBooks.get('/:id', async (req, res) => {
    const { id } = req.params;

    const book = await repo.getBook(req.params.id);

    if (!book) {
        return res.redirect('/404');
    } 
        
    res.render("books/view", {
        title: "Book | view",
        book
    });
});

routerBooks.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    const book = await repo.getBook(id);

    if (!book) {
        res.redirect('/404');
    } 

    res.render("books/update", {
        title: "Book | update",
        book,
    });
});

export default routerBooks;
