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

    const activeTasks = tasks.filter(t => t.status !== 'Done');
    const completedTasks = tasks.filter(t => t.status === 'Done');
    const overdueTasks = activeTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());

    res.json({
      totalProjects: projects.length,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length
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
