const express = require('express');

const router = express.Router();

const { getAllNotes, getNoteById, createNote, updateNote, deleteNote, getNoteByCategory } = require('../controllers/noteController');
const validateNote = require('../middleware/validateNote');


router.get('/', getAllNotes);
router.get('/category/:category', getNoteByCategory);
router.get('/:id', getNoteById);
router.post('/', validateNote, createNote);
router.put('/:id', validateNote, updateNote);
router.delete('/:id', deleteNote)

module.exports = router;