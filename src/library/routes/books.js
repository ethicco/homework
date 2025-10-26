const express = require('express');
const uuid = require('uuid');
const multer = require('../middleware/file');
const { store } = require('./index');

const routerBooks = express.Router();

routerBooks.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Book | create",
        book: {},
    });
});

routerBooks.get('/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    } 
        
    res.render("books/view", {
        title: "Book | view",
        book: books[idx],
    });
});

routerBooks.get('/update/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    } 

    res.render("books/update", {
        title: "Book | update",
        book: books[idx],
    });
});

module.exports = routerBooks