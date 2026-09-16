import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ProtectedRoute = ({ children, role }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'student' ? '/student-dashboard' : '/dashboard'} replace />;
  }

  if (role === 'student') {
    return children;
  }

  // If token exists, render the layout with the Sidebar and Navbar
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar fixed on the left */}
      <Sidebar />
      
      {/* Main content area wrapped on the right */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        
        {/* Scrollable page content (Dashboard, StudentList, etc.) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;