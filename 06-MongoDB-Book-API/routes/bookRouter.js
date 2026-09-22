const express = require('express');
const router = express.Router();

const { getAllBooks, getBookById, addBook, updateBook, deleteBook, getBookStats } = require("../controllers/bookController")

router.get('/', getAllBooks);
router.get('/stats', getBookStats);
router.get('/:id', getBookById);
router.post('/', addBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
module.exports = router;