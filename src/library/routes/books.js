const express = require('express');
const BookModel = require('../models/book');

const routerBooks = express.Router();

routerBooks.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Book | create",
        book: {},
    });
});

routerBooks.get('/:id', async (req, res) => {
    const { id } = req.params;
    const book = await BookModel.findById(id)

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
    const book = await BookModel.findById(id);

    if (!book) {
        res.redirect('/404');
    } 

    res.render("books/update", {
        title: "Book | update",
        book,
    });
});

module.exports = routerBooks