const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('./server/models/Project');
const Task = require('./server/models/Task');
const User = require('./server/models/User');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const taskCount = await Task.countDocuments();

    console.log(`Users: ${userCount}`);
    console.log(`Projects: ${projectCount}`);
    console.log(`Tasks: ${taskCount}`);

    if (taskCount > 0) {
      const tasks = await Task.find().limit(5);
      console.log('Sample Tasks:', tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority })));
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
