const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    });
    
    const projectIds = projects.map(p => p._id);
    
    // Filter tasks: Members only see assigned tasks, Admins see all tasks in their projects
    let taskQuery;
    if (req.user.role === 'Admin') {
      taskQuery = {
        $or: [
          { project: { $in: projectIds } },
          { assignee: userId },
          { assignees: userId }
        ]
      };
    } else {
      taskQuery = {
        $or: [
          { assignee: userId },
          { assignees: userId }
        ]
      };
    }

    const tasks = await Task.find(taskQuery);

    const todoTasks = tasks.filter(t => t.status === 'Todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const doneTasks = tasks.filter(t => t.status === 'Done').length;

    const highPriority = tasks.filter(t => t.priority === 'High').length;
    const mediumPriority = tasks.filter(t => t.priority === 'Medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'Low').length;

    // Real Team Progress Calculation
    const teamStatsMap = {};
    tasks.forEach(task => {
      const assigneeIds = [
        ...(task.assignees || []).map(member => member.toString()),
        ...(task.assignee ? [task.assignee.toString()] : [])
      ];

      assigneeIds.forEach(assigneeId => {
        if (!teamStatsMap[assigneeId]) {
          teamStatsMap[assigneeId] = { total: 0, completed: 0 };
        }
        teamStatsMap[assigneeId].total++;
        if (task.status === 'Done') teamStatsMap[assigneeId].completed++;
      });
    });

    // Get user details for the team members
    const teamMemberIds = Object.keys(teamStatsMap);
    const users = await User.find({ _id: { $in: teamMemberIds } });
    
    const teamProgress = users.map(user => ({
      name: user.name,
      avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      completed: teamStatsMap[user._id.toString()].completed,
      total: teamStatsMap[user._id.toString()].total
    })).sort((a, b) => (b.completed / b.total) - (a.completed / a.total))
      .slice(0, 5);

    console.log('DEBUG: Team Progress Data:', teamProgress);

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
      ],
      teamProgress // New real data
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
