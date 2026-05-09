const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { auth, authorize } = require('../middleware/auth');

// Get all tasks for a project
router.get('/project/:projectId', auth, taskController.getTasksByProject);

// Create task
router.post('/', auth, taskController.createTask);

// Update task status
router.patch('/:id', auth, taskController.updateTask);

// Delete task (Admin only)
router.delete('/:id', auth, authorize('Admin'), taskController.deleteTask);

module.exports = router;
