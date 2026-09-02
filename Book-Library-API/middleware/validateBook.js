module.exports = (req, res, next) => {
    const { title, author, genre, status } = req.body;

    if (!title || !author || !genre || !status) {
        return res.status(400).json(
            { message: 'title, author, genre, status are required fields' }
        );
    }

    const validStatuses = ['available', 'borrowed', 'reserved'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json(
            { message: 'Invalid status' }
        );
    }

    const validGenres = ['fiction', 'non-fiction', 'mystery', 'fantasy', 'science fiction', 'biography', 'history', 'romance'];
    if (!validGenres.includes(genre)) {
        return res.status(400).json(
            { message: 'Invalid genre' }
        );
    }
    next();
}