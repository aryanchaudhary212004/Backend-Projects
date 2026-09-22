const mongoose = require('mongoose');
const Book = require('../models/Book');
const { search } = require('../routes/bookRouter');
const { request } = require('express');

async function getAllBooks(req, res) {
    const { status, genre, search, sort, order = 'asc' } = req.query;

    //filtering and validation

    const validStatuses = ['available', 'borrowed', 'reserved'];
    const validGenres = ['fiction', 'non-fiction', 'mystery', 'fantasy', 'biography'];

    const filter = {};
    if (status) {
        if(!validStatuses.includes(status)) {
            return res.status(400).json(
                { message: 'Invalid status value' }
            );
        }
        filter.status = status;
    }

    if (genre) {
        if(!validGenres.includes(genre)) {
            return res.status(400).json(
                { message: 'Invalid genre value' }
            );
        }
        filter.genre = genre;
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } }
        ];
    }

    //sorting

    const validSorts = ['title', 'author', 'genre', 'status'];
    const validOrder = ['asc', 'desc'];
    const sortOption = {};
    if ( sort && !validSorts.includes(sort) ) {
        return res.status(400).json(
            { message: 'Invalid sort value' }
        );
    }
    if ( order && !validOrder.includes(order) ) {
        return res.status(400).json(
            { message: 'Invalid order value' }
        );
    }
    if (sort) {
        sortOption[sort] = order === 'asc' ? 1 : -1;
    }

    //pagination

    let page = req.query.page !== undefined? Number(req.query.page) : 1;
    let limit = req.query.limit !== undefined? Number(req.query.limit) : 10;

    if ( page<1 || limit<1 || !Number.isInteger(page) || !Number.isInteger(limit) || limit>50 ) {
        return res.status(400).json(
            { message: 'Invalid page or limit value'}
        );
    }

    const skip = (page - 1) * limit;
    const totalBooks = await Book.countDocuments(filter);
    const books = await Book.find(filter).sort(sortOption).skip(skip).limit(limit).select('title author genre');

    res.json({
        page,
        limit,
        totalBooks,
        totalPages: Math.ceil(totalBooks/limit),
        books
    });

}

async function getBookById(req, res) {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(
            { message: 'Invalid book ID' }
        );
    }
    const book = await Book.findById(id);

    if(!book) {
        return res.status(404).json(
            { message: 'Book not found' }
        );
    }
    res.json(book);
}

async function addBook(req, res) {
    const { title, author, genre, status } = req.body;
    const book = await Book.create({
        title,
        author,
        genre,
        status
    })
    res.status(201).json(book);
}

async function updateBook(req, res) {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(
            { message: 'Invalid book ID' }
        );
    }

    const { title, author, genre, status } = req.body;
    const book = await Book.findByIdAndUpdate(id, 
        {
            title,
            author,
            genre,
            status
        }, { new: true, runValidators: true }
    );

    if(!book) {
        return res.status(404).json(
            { message: 'Book not found' }
        );
    }
    res.json(book);
}

async function deleteBook(req, res) {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(
            { message: 'Invalid book ID' }
        );
    }

    const book = await Book.findByIdAndDelete(id);

    if(!book) {
        return res.status(404).json(
            { message: 'Book not found' }
        );
    }
    res.status(204).send();
}

async function getBookStats(req, res) {
    const stats = await Book.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
    res.json(stats);
}

module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    getBookStats
}