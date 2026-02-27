import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Shield, GraduationCap, Settings } from 'lucide-react';

const RoleSelection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole) => {
    if (selectedRole === 'student') {
      navigate('/student');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    } else if (selectedRole === 'superadmin') {
      navigate('/superadmin');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Main Container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="text-center px-8 py-12 bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6 transform hover:rotate-6 transition-transform duration-300">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Welcome Back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-lg text-gray-600">
              Select your portal to continue
            </p>
          </div>

          {/* Portal Cards */}
          <div className="p-8">
            <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
              {user.role === 'superadmin' && (
                <button
                  onClick={() => handleRoleSelection('superadmin')}
                  className="group relative bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Super Admin</h3>
                    <p className="text-purple-100 text-sm leading-relaxed">
                      System control & user management
                    </p>
                    <div className="mt-6 inline-flex items-center text-white/90 group-hover:text-white text-sm font-medium">
                      Enter Portal
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}

              {user.role === 'student' && (
                <button
                  onClick={() => handleRoleSelection('student')}
                  className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Student Portal</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      Track achievements & activities
                    </p>
                    <div className="mt-6 inline-flex items-center text-white/90 group-hover:text-white text-sm font-medium">
                      Enter Portal
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}

              {user.role === 'admin' && (
                <button
                  onClick={() => handleRoleSelection('admin')}
                  className="group relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Admin Portal</h3>
                    <p className="text-green-100 text-sm leading-relaxed">
                      Manage activities & approvals
                    </p>
                    <div className="mt-6 inline-flex items-center text-white/90 group-hover:text-white text-sm font-medium">
                      Enter Portal
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Pending Approval */}
            {!user.isApproved && user.role === 'admin' && (
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-xl p-6 shadow-lg">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-amber-900 mb-1">
                      Pending Approval
                    </h3>
                    <p className="text-amber-800 text-sm">
                      Your admin account is awaiting approval from the System Administrator.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div>
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-gray-500 text-xs">Role</p>
                    <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                  </div>
                </div>
                {user.department && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-gray-500 text-xs">Department</p>
                      <p className="text-gray-900 font-medium">{user.department}</p>
                    </div>
                  </div>
                )}
                {user.year && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-gray-500 text-xs">Year</p>
                      <p className="text-gray-900 font-medium">Year {user.year}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;