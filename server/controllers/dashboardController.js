const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    });
    
    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({
      $or: [
        { project: { $in: projectIds } },
        { assignee: userId }
      ]
    });

    const todoTasks = tasks.filter(t => t.status === 'Todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const doneTasks = tasks.filter(t => t.status === 'Done').length;

    const highPriority = tasks.filter(t => t.priority === 'High').length;
    const mediumPriority = tasks.filter(t => t.priority === 'Medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'Low').length;

    res.json({
      totalProjects: projects.length,
      activeTasks: todoTasks + inProgressTasks,
      completedTasks: doneTasks,
      overdueTasks: tasks.filter(t => t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < new Date()).length,
      taskStatusDistribution: [
        { name: 'Todo', value: todoTasks },
        { name: 'In Progress', value: inProgressTasks },
        { name: 'Done', value: doneTasks }
      ],
      priorityDistribution: [
        { name: 'High', value: highPriority },
        { name: 'Medium', value: mediumPriority },
        { name: 'Low', value: lowPriority }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
                                            .sort({ createdAt: -1 })
                                            .limit(10);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, 
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
