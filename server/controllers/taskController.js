const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const User = require('../models/User');

const normalizeAssignees = (body) => {
  if (Array.isArray(body.assignees)) {
    return body.assignees.filter(Boolean);
  }

  if (body.assignee !== undefined) {
    return body.assignee ? [body.assignee] : [];
  }

  return undefined;
};

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name email')
      .populate('assignees', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, project, dueDate } = req.body;
    const assignees = normalizeAssignees(req.body) || [];
    const task = new Task({
      title,
      description,
      status,
      priority,
      assignee: assignees[0] || null,
      assignees,
      project,
      dueDate
    });
    await task.save();
    
    if (assignees.length > 0) {
      const proj = await Project.findByIdAndUpdate(project, { $addToSet: { members: { $each: assignees } } });

      await Promise.all(assignees.map(userId => Notification.create({
        user: userId,
        message: `You have been assigned a new task: "${title}" in project "${proj ? proj.title : 'Unknown'}"`,
        type: 'assignment'
      })));
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const existingAssignees = (task.assignees && task.assignees.length > 0)
      ? task.assignees.map(member => member.toString())
      : (task.assignee ? [task.assignee.toString()] : []);
    const nextAssignees = normalizeAssignees(req.body);

    if (nextAssignees !== undefined) {
      const canChangeAssignee = req.user.role === 'Admin' || (project && project.owner.toString() === req.user.id);
      if (!canChangeAssignee) {
        return res.status(403).json({ message: 'Only admins can reassign tasks' });
      }
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.priority !== undefined) task.priority = req.body.priority;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || null;
    if (nextAssignees !== undefined) {
      task.assignees = nextAssignees;
      task.assignee = nextAssignees[0] || null;
    }

    await task.save();

    if (nextAssignees !== undefined && project) {
      await Project.findByIdAndUpdate(project._id, { $addToSet: { members: { $each: nextAssignees } } });

      const newlyAddedAssignees = nextAssignees.filter(memberId => !existingAssignees.includes(memberId));
      await Promise.all(newlyAddedAssignees.map(userId => Notification.create({
        user: userId,
        message: `You have been assigned to task "${task.title}" in project "${project.title}"`,
        type: 'assignment'
      })));
    }
    
    if (req.body.status && project) {
      const updater = await User.findById(req.user.id);
      
      if (project.owner.toString() !== req.user.id) {
        await Notification.create({
          user: project.owner,
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

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
