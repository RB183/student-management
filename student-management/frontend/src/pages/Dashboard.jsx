import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    recentStudents: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Calls GET http://localhost:5000/api/students/dashboard
        const response = await API.get('/students/dashboard');
        setStats(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-lg">
        Loading dashboard statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Here is the latest overview of your student records.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Students" value={stats.totalStudents} borderColor="border-blue-500" />
        <StatCard title="Active Students" value={stats.activeStudents} borderColor="border-green-500" />
        <StatCard title="Inactive Students" value={stats.inactiveStudents} borderColor="border-red-500" />
      </div>

      {/* Recently Added Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Recently Added Students</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b">
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No students found. Add your first student to see them here!
                    </td>
                  </tr>
                ) : (
                stats.recentStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center">
                      {student.profileImage?.url ? (
                        <img
                          src={student.profileImage.url}
                          alt={student.fullName}
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                            event.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                          className="w-10 h-10 rounded-full object-cover mr-4 border border-gray-200"
                        />
                      ) : null}
                      <div
                        className={`w-10 h-10 rounded-full bg-blue-100 text-blue-700 items-center justify-center font-bold text-sm mr-4 border border-blue-200 ${
                          student.profileImage?.url ? 'hidden' : 'flex'
                        }`}
                      >
                        {student.fullName
                          ? student.fullName.split(' ').map((name) => name[0]).join('').substring(0, 2).toUpperCase()
                          : 'S'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.fullName}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.course}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable micro-component to keep the grid code clean
const StatCard = ({ title, value, borderColor }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${borderColor}`}>
    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
    <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default Dashboard;