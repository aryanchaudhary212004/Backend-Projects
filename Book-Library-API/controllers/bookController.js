const books = require('../data/books');

function getAllBooks(req, res) {

    const { status, genre } = req.query;

    //filtering and validation

    const validStatuses = ['available', 'borrowed', 'reserved'];
    const validGenres = ['fiction', 'non-fiction', 'mystery', 'fantasy', 'biography'];

    if (status && !validStatuses.includes(status)) {
        return res.status(400).json(
            { message: 'Invalid status value' }
        );
    }
    if (genre && !validGenres.includes(genre)) {
        return res.status(400).json(
            { message: 'Invalid genre value' }
        );
    }

    let filteredBooks = books.filter(book => {
        return (
            (status ? book.status === status : true) &&
            (genre ? book.genre === genre : true)
        );
    })

    //searching

    const search = req.query.search;
    if (search) {
        filteredBooks = filteredBooks.filter(book => {
        return (
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase())
            );
        });
    }

    //sorting

    const sort = req.query.sort;
    const order = req.query.order || 'asc';
    const validSorts = ['title', 'author', 'genre', 'status'];
    const validOrder = ['asc', 'desc'];

    if (sort && !validSorts.includes(sort)) {
        return res.status(400).json(
            { message: 'Invalid sort value' }
        );
    }
    if (!validOrder.includes(order)) {
        return res.status(400).json(
            { message: 'Invalid order value' }
        );
    }
    if (sort) {
        filteredBooks.sort((a, b) => {
            const comparison = a[sort].localeCompare(b[sort]);
            return order === 'asc' ? comparison : -comparison;
        });
    }

    //paginnation

    let page = req.query.page !== undefined ? Number(req.query.page) : 1;
    let limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;

    if (page < 1 || limit < 1 || !Number.isInteger(page) || !Number.isInteger(limit) || limit > 50) {
        return res.status(400).json(
            { message: 'Invalid page or limit value' }
        );
    }

    const totalBooks = filteredBooks.length;
    const totalPages = Math.ceil(totalBooks/limit);
    filteredBooks = filteredBooks.slice((page - 1) * limit, (page - 1) * limit + limit);
    res.json({
        'page': page,
        'limit': limit,
        'totalBooks': totalBooks,
        'totalPages': totalPages,
        'books': filteredBooks
    });
}

function getBookStats(req, res) {
    res.json({
        total: books.length,
        byStatus: {
            available: books.filter(book => book.status === 'available').length,
            borrowed: books.filter(book => book.status === 'borrowed').length,
            reserved: books.filter(book => book.status === 'reserved').length
        },
        byGenre: {
            fantasy: books.filter(book => book.genre === 'fantasy').length,
            fiction: books.filter(book => book.genre === 'fiction').length,
            'non-fiction': books.filter(book => book.genre === 'non-fiction').length,
            mystery: books.filter(book => book.genre === 'mystery').length,
            biography: books.filter(book => book.genre === 'biography').length
        }
    });
}

function getBookById(req, res) {
    const book = books.find(b => b.id === Number(req.params.id));
    if(!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
}

let nextId = 8;

function addBook(req, res) {
    const { title, author, genre, status} = req.body;
    const newBook = {
        id: nextId++,
        title,
        author,
        genre,
        status
    };
    books.push(newBook);
    res.status(201).json(newBook);
}

function updateBook(req, res) {
    const book = books.find(b => b.id === Number(req.params.id));
    if(!book) {
        return res.status(404).json(
            { message: 'Book not found' }
        )
    }
    const { title, author, genre, status } = req.body;
    book.title = title;
    book.author = author;
    book.genre = genre;
    book.status = status;
    res.json(book);
}

function deleteBook(req, res) {
    const bookIndex = books.findIndex(b => b.id === Number(req.params.id));
    if(bookIndex === -1) {
        return res.status(404).json(
            { message: 'Book not found' }
        )
    }
    books.splice(bookIndex, 1);
    res.status(204).send();
}

module.exports = {
    getAllBooks,
    getBookStats,
    getBookById,
    addBook,
    updateBook,
    deleteBook
}