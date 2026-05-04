import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProjectList from './pages/ProjectList'
import ProjectDetails from './pages/ProjectDetails'
import Team from './pages/Team'
import Messages from './pages/Messages'
import Settings from './pages/Settings'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#ff5c00] dark:bg-[#0b0b0b]">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#ff5c00]/30 dark:bg-[#0b0b0b] dark:text-white transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <PrivateRoute>
                    <ProjectList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/projects/:id" 
                element={
                  <PrivateRoute>
                    <ProjectDetails />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/team" 
                element={
                  <PrivateRoute>
                    <Team />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <PrivateRoute>
                    <Messages />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
