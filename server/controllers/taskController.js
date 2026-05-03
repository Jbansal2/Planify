const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignee, project, dueDate } = req.body;
    const task = new Task({ title, description, status, priority, assignee, project, dueDate });
    await task.save();
    
    if (assignee) {
      const proj = await Project.findByIdAndUpdate(project, { $addToSet: { members: assignee } });
      
      await Notification.create({
        user: assignee,
        message: `You have been assigned a new task: "${title}" in project "${proj ? proj.title : 'Unknown'}"`,
        type: 'assignment'
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (req.body.status) {
      const proj = await Project.findById(task.project);
      const updater = await User.findById(req.user.id);
      
      if (proj && proj.owner.toString() !== req.user.id) {
        await Notification.create({
          user: proj.owner,
          message: `Task "${task.title}" was moved to "${req.body.status}" by ${updater ? updater.name : 'a team member'}`,
          type: 'system'
        });
      }
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
