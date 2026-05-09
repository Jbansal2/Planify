require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const messageRoutes = require('./routes/messages');

const app = express();

// ===============================
// TERMINAL BANNER
// ===============================
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const PURPLE = '\x1b[35m';
const CYAN   = '\x1b[36m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const MUTED  = '\x1b[90m';

console.log(`
${PURPLE}${BOLD}██╗  ██╗███████╗██████╗ ██████╗ 
██║  ██║██╔════╝██╔══██╗██╔══██╗
███████║█████╗  ██████╔╝██████╔╝
██╔══██║██╔══╝  ██╔══██╗██╔══██╗
██║  ██║███████╗██║  ██║██║  ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝${RESET}

${CYAN}${BOLD}[PLANIFY BACKEND SERVER v1.0]${RESET}

${GREEN}[✓]${RESET} Loading environment variables...
`);

// ===============================
// MIDDLEWARE
// ===============================
console.log(`${GREEN}[✓]${RESET} Initializing Express middleware...`);

app.use(cors({
  origin: [
    'https://planify-sable.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

console.log(`
${GREEN}[✓]${RESET} CORS configured for:
    ${MUTED}→${RESET} ${CYAN}https://planify-sable.vercel.app${RESET}
    ${MUTED}→${RESET} ${CYAN}http://localhost:5173${RESET}
`);

// ===============================
// ROOT ROUTE
// ===============================
app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

// ===============================
// API ROUTES
// ===============================
console.log(`${GREEN}[✓]${RESET} Mounting API routes...`);
console.log(`    ${YELLOW}/api/auth${RESET}      ${MUTED}→${RESET} ${CYAN}authRoutes${RESET}`);
console.log(`    ${YELLOW}/api/projects${RESET}  ${MUTED}→${RESET} ${CYAN}projectRoutes${RESET}`);
console.log(`    ${YELLOW}/api/tasks${RESET}     ${MUTED}→${RESET} ${CYAN}taskRoutes${RESET}`);
console.log(`    ${YELLOW}/api/users${RESET}     ${MUTED}→${RESET} ${CYAN}userRoutes${RESET}`);
console.log(`    ${YELLOW}/api/dashboard${RESET} ${MUTED}→${RESET} ${CYAN}dashboardRoutes${RESET}`);
console.log(`    ${YELLOW}/api/messages${RESET}  ${MUTED}→${RESET} ${CYAN}messageRoutes${RESET}\n`);

app.use('/api/auth',      authRoutes);
app.use('/api/projects',  projectRoutes);
app.use('/api/tasks',     taskRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages',  messageRoutes);

// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error(`${RED}[✗] SERVER ERROR:${RESET}`, err.stack);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

console.log(`${GREEN}[✓]${RESET} Error handling middleware attached`);

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

console.log(`${GREEN}[✓]${RESET} 404 handler registered`);

// ===============================
// DATABASE CONNECTION
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`\n${GREEN}[✓]${RESET} Connected to MongoDB Atlas`);
  })
  .catch((err) => {
    console.error(`\n${RED}[✗]${RESET} MongoDB connection error:`, err);
  });

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
${GREEN}[✓]${RESET} ${BOLD}Server running successfully!${RESET}
    ${MUTED}Local URL   :${RESET} ${CYAN}http://localhost:${PORT}${RESET}
    ${MUTED}Environment :${RESET} ${YELLOW}${process.env.NODE_ENV || 'development'}${RESET}
`);
});