const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth, authorize } = require('../middleware/auth');

// Get all projects for a user
router.get('/', auth, projectController.getProjects);

// Create project (Admin only)
router.post('/', auth, authorize('Admin'), projectController.createProject);

// Update project (Admin only)
router.patch('/:id', auth, authorize('Admin'), projectController.updateProject);

// Delete project (Admin only)
router.delete('/:id', auth, authorize('Admin'), projectController.deleteProject);

module.exports = router;
