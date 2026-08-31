const express = require('express');
const router = express.Router();

const { getAllTasks, getTaskStats, getTaskById, addTask, updateTask, deleteTask } = require('../controllers/taskController');
const validateTask = require('../middleware/validateTask')

router.get('/', getAllTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.post('/', validateTask, addTask );
router.put('/:id', validateTask, updateTask);
router.delete('/:id', deleteTask);

module.exports = router