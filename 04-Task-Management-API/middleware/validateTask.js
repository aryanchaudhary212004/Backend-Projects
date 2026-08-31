module.exports = (req, res, next) => {
    const { title, description, status, priority, category } = req.body;

    if (!title || !description || !status || !priority || !category){
        return res.status(400).json(
            { message: 'title, description, status, priority, category are required fields'}
        )
    }
    const validStatuses = ['pending', 'in-progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high'];
    const validCategories = ['backend', 'frontend', 'personal', 'college'];

    if ( !validStatuses.includes(status) ) {
        return res.status(400).json({ message: "Invalid status"});
    }

    if ( !validPriorities.includes(priority) ) {
        return res.status(400).json({ message: "Invalid priority"});
    }

    if ( !validCategories.includes(category) ) {
        return res.status(400).json({ message: "Invalid category"});
    }

    next()
}