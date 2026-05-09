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

exports.updateProject = async (req, res) => {
  try {
    const { title, description, members, dueDate } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (dueDate !== undefined) project.dueDate = dueDate || null;
    if (members !== undefined) project.members = members;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Promise.all([
      Project.deleteOne({ _id: req.params.id }),
      require('../models/Task').deleteMany({ project: req.params.id })
    ]);

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
