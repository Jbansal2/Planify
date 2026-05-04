PLANIFY - PREMIUM PROJECT MANAGEMENT DASHBOARD

Planify is a high-performance, full-stack project management ecosystem designed with a premium "Webflow-inspired" dark aesthetic. It offers teams a seamless way to collaborate, track projects, manage tasks, and communicate in real-time within a unified, secure workspace.

================================================================================
KEY FEATURES
================================================================================

DYNAMIC DASHBOARD
- Real-time Overview: Get an instant snapshot of total projects, active tasks, and team members.
- Visual Analytics: Interactive task distribution charts and recent activity feeds.
- Smart Notifications: Integrated alert system to keep you updated on project milestones and mentions.

PROJECT & TASK MANAGEMENT
- Centralized Projects: Beautiful grid/list views of all ongoing projects with progress tracking.
- Agile Task Boards: A professional Kanban-style interface to manage tasks across "Todo", "In Progress", and "Done".
- Due Date Logic: Visual indicators for upcoming and overdue tasks.
- Admin Control: Secure project creation and task assignment capabilities.

REAL-TIME MESSAGING
- Direct Messaging: A sleek, two-column chat interface for 1-on-1 communication.
- Auto-Sync Polling: Real-time feeling chat experience without page refreshes.
- Searchable Contacts: Quickly find and chat with any member of your workspace.

TEAM COLLABORATION
- Member Management: Professional row-based team list with role indicators (Admin/Member).
- Security Controls: Admins can easily manage user access and account statuses.

PERSONALIZED EXPERIENCE
- Profile Management: Update personal details (Name, Email) and account security (Password) instantly.
- Fixed Sidebar Layout: Intuitive navigation that stays fixed while the main workspace scrolls smoothly.

================================================================================
TECH STACK
================================================================================

FRONTEND
- React.js: Modern component-based UI logic.
- Vite: Ultra-fast build tool for development.
- Tailwind CSS: Utility-first styling for a custom, premium look.
- Framer Motion: High-fidelity UI animations and transitions.
- Axios: Secure API communication.

BACKEND
- Node.js & Express: Scalable server-side architecture.
- MongoDB & Mongoose: Flexible NoSQL database for structured data persistence.
- JWT (JSON Web Tokens): Secure, stateless authentication.
- Bcrypt.js: Industry-standard password hashing.

================================================================================
GETTING STARTED
================================================================================

1. PREREQUISITES
- Node.js (v16.x or higher)
- MongoDB (Local instance or MongoDB Atlas)

2. INSTALLATION

   1. Clone the repository:
      git clone [repository-url]
      cd Planify

   2. Install Dependencies:
      # Install Frontend dependencies
      cd frontend
      npm install

      # Install Backend dependencies
      cd ../server
      npm install

3. ENVIRONMENT SETUP
Create a .env file in the /server directory:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key

4. RUNNING THE APPLICATION

   Run Backend:
   cd server
   npm run dev

   Run Frontend:
   cd frontend
   npm run dev

   Navigate to http://localhost:5173 to see the app in action.

================================================================================
LICENSE
================================================================================
Distributed under the MIT License.

Developed with <3 for premium team collaboration.
