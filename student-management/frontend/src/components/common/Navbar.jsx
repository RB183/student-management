import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="flex items-center justify-end px-8 py-4">
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              RB
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-gray-800">Ronit Banerjee</p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
          </div>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <button 
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Log Out
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;