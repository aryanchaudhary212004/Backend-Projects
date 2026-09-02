const express = require('express');
const router = express.Router();

const { getAllBooks, getBookStats, getBookById, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const validateBook = require('../middleware/validateBook');

router.get('/', getAllBooks);
router.get('/stats', getBookStats);
router.get('/:id', getBookById);
router.post('/', validateBook, addBook);
router.put('/:id', validateBook, updateBook);
router.delete('/:id', deleteBook);

module.exports = router;