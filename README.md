# ✳️ Planify - Premium Project Management Dashboard

Planify is a high-performance, full-stack project management ecosystem designed with a premium "Webflow-inspired" dark aesthetic. It offers teams a seamless way to collaborate, track projects, manage tasks, and communicate in real-time within a unified, secure workspace.

---

## ✨ Key Features

### 📊 Dynamic Dashboard
- **Real-time Overview**: Get an instant snapshot of total projects, active tasks, and team members.
- **Visual Analytics**: Interactive task distribution charts and recent activity feeds.
- **Smart Notifications**: Integrated alert system to keep you updated on project milestones and mentions.

### 📁 Project & Task Management
- **Centralized Projects**: Beautiful grid/list views of all ongoing projects with progress tracking.
- **Agile Task Boards**: A professional Kanban-style interface to manage tasks across "Todo", "In Progress", and "Done".
- **Due Date Logic**: Visual indicators for upcoming and overdue tasks.
- **Admin Control**: Secure project creation and task assignment capabilities.

### 💬 Real-time Messaging
- **Direct Messaging**: A sleek, two-column chat interface for 1-on-1 communication.
- **Auto-Sync Polling**: Real-time feeling chat experience without page refreshes.
- **Searchable Contacts**: Quickly find and chat with any member of your workspace.

### 👥 Team Collaboration
- **Member Management**: Professional row-based team list with role indicators (Admin/Member).
- **Security Controls**: Admins can easily manage user access and account statuses.

### ⚙️ Personalized Experience
- **Profile Management**: Update personal details (Name, Email) and account security (Password) instantly.
- **Fixed Sidebar Layout**: Intuitive navigation that stays fixed while the main workspace scrolls smoothly.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern component-based UI logic.
- **Vite**: Ultra-fast build tool for development.
- **Tailwind CSS**: Utility-first styling for a custom, premium look.
- **Framer Motion**: High-fidelity UI animations and transitions.
- **Axios**: Secure API communication.

### Backend
- **Node.js & Express**: Scalable server-side architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database for structured data persistence.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Bcrypt.js**: Industry-standard password hashing.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v16.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas)

### 2. Installation

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd Planify
   ```

2. **Install Dependencies**:
   ```bash
   # Install Frontend dependencies
   cd frontend
   npm install

   # Install Backend dependencies
   cd ../server
   npm install
   ```

### 3. Environment Setup
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 4. Running the Application

**Run Backend:**
```bash
cd server
npm run dev
```

**Run Frontend:**
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` to see the app in action.

---

## Project Structure

```text
├── frontend/             # React Frontend (Vite)
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   └── package.json      # Dependencies
├── server/               # Express Backend
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API Endpoints
│   └── server.js         # Entry point
├── .gitignore            # Root gitignore
└── README.md             # Project documentation
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ for premium team collaboration.
