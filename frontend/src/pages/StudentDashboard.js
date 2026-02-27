import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { achievementsAPI } from '../services/api';
import { Trophy, Calendar, Award, Clock, TrendingUp, Download } from 'lucide-react';
import Achievements from './Achievements';
import Activities from './Activities';
import Profile from './Profile';

const StudentOverview = () => {
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, achievementsRes] = await Promise.all([
        achievementsAPI.getAchievementStats(),
        achievementsAPI.getAchievements({ limit: 5 })
      ]);
      
      setStats(statsRes.data.data?.overview || {});
      setAchievements(achievementsRes.data.achievements || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStats({});
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Participations',
      value: stats?.total || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Approved Awards',
      value: stats?.approved || 0,
      icon: Trophy,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Points',
      value: (achievements || []).reduce((sum, ach) => sum + (ach.points || 0), 0),
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Achievement Dashboard</h1>
        <p className="text-blue-100">Track your extracurricular journey and showcase your accomplishments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award className="h-5 w-5 mr-2 text-blue-600" />
            Recent Achievements
          </h2>
        </div>
        
        <div className="p-6">
          {achievements.length > 0 ? (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      achievement.status === 'approved' ? 'bg-green-100' :
                      achievement.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Trophy className={`h-4 w-4 ${
                        achievement.status === 'approved' ? 'text-green-600' :
                        achievement.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{achievement.awardTitle}</h3>
                      <p className="text-sm text-gray-600">{achievement.activity?.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      achievement.status === 'approved' ? 'bg-green-100 text-green-800' :
                      achievement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {achievement.status}
                    </span>
                    
                    {achievement.certificateUrl && achievement.status === 'approved' && (
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No achievements yet. Start participating in activities!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/student/achievements'}
              className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="font-medium text-blue-900">Submit New Achievement</div>
              <div className="text-sm text-blue-700">Add your latest accomplishment</div>
            </button>
            <button 
              onClick={() => window.location.href = '/student/activities'}
              className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="font-medium text-green-900">Browse Activities</div>
              <div className="text-sm text-green-700">Find new opportunities to participate</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Tips</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p>Upload clear photos of certificates and participation proof</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p>Provide detailed descriptions of your achievements</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p>Keep track of all your extracurricular activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentOverview />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default StudentDashboard;