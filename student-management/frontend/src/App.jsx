import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages & Components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentForm from './components/students/StudentForm'; // Added this import
import Welcome from './pages/Welcome';
import StudentPortal from './pages/StudentPortal';
import StudentDashboard from './pages/StudentDashboard';

const App = () => {
  return (
    <Router>
      {/* AuthProvider must be inside Router to use navigation hooks */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />

          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Wrapped in the security guard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute role="admin">
                <Dashboard/> 
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/students" 
            element={
              <ProtectedRoute role="admin">
                <StudentList/> 
              </ProtectedRoute>
            } 
          />

          {/* NEW: Route for adding a new student */}
          <Route 
            path="/students/new" 
            element={
              <ProtectedRoute role="admin">
                <StudentForm />
              </ProtectedRoute>
            } 
          />

          {/* NEW: Route for editing an existing student */}
          <Route 
            path="/students/edit/:id" 
            element={
              <ProtectedRoute role="admin">
                <StudentForm />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Redirect - Catch all unknown URLs */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;