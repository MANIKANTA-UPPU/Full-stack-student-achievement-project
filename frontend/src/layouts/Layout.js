import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Trophy, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  User,
  BarChart3,
  FileText,
  Award
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentNavItems = [
    { name: 'Dashboard', icon: Home, path: '/student' },
    { name: 'My Achievements', icon: Trophy, path: '/student/achievements' },
    { name: 'Activities', icon: Calendar, path: '/student/activities' },
    { name: 'Profile', icon: User, path: '/student/profile' }
  ];

  const adminNavItems = [
    { name: 'Dashboard', icon: Home, path: '/admin' },
    { name: 'Activities', icon: Calendar, path: '/admin/activities' },
    { name: 'Achievements', icon: Award, path: '/admin/achievements' },
    { name: 'Students', icon: Users, path: '/admin/students' }
  ];

  const superAdminNavItems = [
    { name: 'Dashboard', icon: Home, path: '/superadmin' },
    { name: 'Pending Approvals', icon: Award, path: '/superadmin' },
    { name: 'All Users', icon: Users, path: '/superadmin' }
  ];

  const navItems = user?.role === 'student' ? studentNavItems : 
                   user?.role === 'superadmin' ? superAdminNavItems : adminNavItems;

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'md:hidden' : 'hidden md:flex'} flex-col w-64 bg-gray-900`}>
      <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
        <h1 className="text-white text-lg font-semibold">Student Achievements</h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              navigate(item.path);
              if (mobile) setSidebarOpen(false);
            }}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white group"
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center cursor-pointer" onClick={() => navigate(user?.role === 'student' ? '/student/profile' : user?.role === 'superadmin' ? '/superadmin' : '/admin')}>
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.role === 'student' ? 'Student Portal' : 
                 user?.role === 'superadmin' ? 'Super Admin Portal' : 'Admin Portal'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;