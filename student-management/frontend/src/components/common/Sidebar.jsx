import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-6 text-center border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white tracking-wide">Admin<span className="text-blue-500">Portal</span></h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          Dashboard
        </NavLink>
        
        <NavLink
          to="/students"
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          Student Directory
        </NavLink>
      </nav>

      <div className="p-4 text-xs text-gray-500 text-center border-t border-gray-800">
        &copy; 2026 Student Management
      </div>
    </aside>
  );
};

export default Sidebar;