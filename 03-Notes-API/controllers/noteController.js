const notes = require('../data/notes');

function getAllNotes(req, res) {
    res.json(notes);
}

function getNoteById(req, res) {
    const note = notes.find(n => n.id === Number(req.params.id));
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
}

let nextId = notes.length + 1;

function createNote(req, res) {
    const { title, content, category } = req.body;
    const newNote = {
        id: nextId++,
        title,
        content,
        category
    }
    notes.push(newNote);
    res.status(201).json(newNote);
}

function updateNote(req, res) {
    const note = notes.find(n => n.id === Number(req.params.id));
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    const { title, content, category } = req.body;
    note.title = title;
    note.content = content;
    note.category = category;
    res.json(note);
}

function deleteNote(req, res) {
    const noteIndex = notes.findIndex(n => n.id === Number(req.params.id));
    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }
    notes.splice(noteIndex, 1);
    res.status(204).send()
}

function getNoteByCategory(req, res) {
    const category = req.params.category;
    const filteredNotes = notes.filter(n => n.category.toLowerCase() === category.toLowerCase());
    if (filteredNotes.length === 0) {
        return res.status(404).json({ message: 'No notes found for this category' });
    }
    res.json(filteredNotes);
}

module.exports = {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote, 
    deleteNote,
    getNoteByCategory
};