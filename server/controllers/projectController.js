const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    })
    .populate('owner', 'name email')
    .populate('members', 'name email');

    const projectsWithStats = await Promise.all(projects.map(async (project) => {
      const totalTasks = await Task.countDocuments({ project: project._id });
      const completedTasks = await Task.countDocuments({ project: project._id, status: 'Done' });
      
      return {
        ...project.toObject(),
        totalTasks,
        completedTasks
      };
    }));

    res.json(projectsWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, members, dueDate } = req.body;
    const project = new Project({
      title,
      description,
      owner: req.user.id,
      members,
      dueDate
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
