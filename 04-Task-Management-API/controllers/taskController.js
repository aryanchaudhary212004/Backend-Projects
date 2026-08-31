const tasks = require('../data/tasks');

function getAllTasks(req, res) {
    const { status, priority, category, search, sort, order } = req.query;
    let page = req.query.page !== undefined ? Number(req.query.page) : 1;
    let limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;
    

    const validStatuses = ['pending', 'in-progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high'];
    const validCategories = ['backend', 'frontend', 'personal', 'college'];
    const validSorts = ['title', 'status', 'priority', 'category'];
    const validOrder = ['asc', 'desc'];

    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
    }

    if (category && !validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category value' });
    }

    if (sort && !validSorts.includes(sort)) {
        return res.status(400).json({ message: 'Invalid sort value' });
    }

    if (order && !validOrder.includes(order)) {
        return res.status(400).json({ message: 'Invalid order value' });
    }

    if (page < 1 || limit < 1 || !Number.isInteger(page) || !Number.isInteger(limit) || limit > 50) {
        return res.status(400).json({ message: 'Invalid page or limit value' });
    }

    let filteredTasks = tasks.filter(task => {
        return (
            (status ? task.status === status : true) &&
            (priority ? task.priority === priority : true) &&
            (category ? task.category === category : true) &&
            (search ? task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase()) : true)
        );
    });

    if (sort) {
        const sortOrder = order || 'desc';
        const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        filteredTasks = [...filteredTasks];
        filteredTasks.sort((a, b) => {
            let comparison;
            if (sort === 'priority') {
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            } else {
                comparison = a[sort].localeCompare(b[sort]);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }

    const totalTasks = filteredTasks.length;
    const totalPages = Math.ceil(totalTasks / limit);
    const startIndex = (page - 1) * limit;
    
    filteredTasks = filteredTasks.slice(startIndex, startIndex + limit);

    res.json({
        page: page,
        limit: limit,
        totalTasks: totalTasks,
        totalPages: totalPages,
        tasks: filteredTasks
    });
}

function getTaskById(req, res){
    const task = tasks.find(t => t.id === Number(req.params.id));
    if (!task){
        return res.status(404).json({ message: 'Task not found'});
    }
    res.json(task);
}

function getTaskStats(req, res){
    res.json({
        'total': tasks.length,
        'byStatus': {
            'pending': tasks.filter(s => s.status==='pending').length,
            'in-progress': tasks.filter(s => s.status==='in-progress').length,
            'completed': tasks.filter(s => s.status==='completed').length
        },
        'byPriority': {
            'low': tasks.filter(s => s.priority === 'low').length,
            'medium': tasks.filter(s => s.priority === 'medium').length,
            'high': tasks.filter(s => s.priority === 'high').length
        },
        'byCategory': {
            'backend': tasks.filter(s => s.category === 'backend').length,
            'frontend': tasks.filter(s => s.category === 'frontend').length,
            'personal': tasks.filter(s => s.category === 'personal').length,
            'college': tasks.filter(s => s.category === 'college').length
        }
    })
}

let nextId = 7

function addTask(req, res) {
    const { title, description, status, priority, category } = req.body;
    const newTask = {
        id: nextId++,
        title,
        description,
        status,
        priority,
        category
    }
    tasks.push(newTask);
    res.status(201).json(newTask);
}

function updateTask(req, res){
    const task = tasks.find(t => t.id === Number(req.params.id));
    if (!task){
        return res.status(404).json({ message: 'Task not found' });
    }
    const { title,
        description,
        status,
        priority,
        category } = req.body;

    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.category = category;

    res.json(task);
}

function deleteTask(req, res){
    const taskIndex = tasks.findIndex(t => t.id === Number(req.params.id));
    if (taskIndex === -1){
        return res.status(404).json({ message: 'Task not found' } );
    }
    tasks.splice( taskIndex, 1);
    res.status(204).send()
}

module.exports = {
    getAllTasks,
    getTaskStats,
    getTaskById,
    addTask,
    updateTask,
    deleteTask
}

