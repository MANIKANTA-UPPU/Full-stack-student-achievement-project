import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { reportsAPI, activitiesAPI, achievementsAPI } from '../services/api';
import { 
  Users, 
  Calendar, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Plus,
  BarChart3,
  PieChart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import AdminActivities from './AdminActivities';
import AdminAchievements from './AdminAchievements';
import AdminStudents from './AdminStudents';
import AdminTeachers from './AdminTeachers';

const AdminOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, activitiesRes, achievementsRes] = await Promise.all([
        reportsAPI.getDashboardData(),
        activitiesAPI.getActivities({ limit: 5 }),
        achievementsAPI.getAchievements({ status: 'pending', limit: 5 })
      ]);
      
      setDashboardData(dashboardRes.data.data || {});
      setRecentActivities(activitiesRes.data.activities || []);
      setPendingAchievements(achievementsRes.data.achievements || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({});
      setRecentActivities([]);
      setPendingAchievements([]);
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

  const overview = dashboardData?.overview || {};
  
  const statCards = [
    {
      title: 'Total Students',
      value: overview.totalStudents || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Activities',
      value: overview.totalActivities || 0,
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Achievements',
      value: overview.totalAchievements || 0,
      icon: Trophy,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Pending Approvals',
      value: overview.pendingApprovals || 0,
      icon: Clock,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  const fieldChartData = dashboardData?.fieldStats?.map(item => ({
    name: item._id,
    count: item.count
  })) || [];

  const categoryChartData = dashboardData?.categoryStats?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-green-100">Manage activities, approve achievements, and monitor student progress</p>
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

      {/* Recent Activities and Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activities
            </h3>
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </button>
          </div>
          
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.category} • {activity.field}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Pending Approvals
            </h3>
          </div>
          
          <div className="p-6">
            {pendingAchievements.length > 0 ? (
              <div className="space-y-4">
                {pendingAchievements.map((achievement) => (
                  <div key={achievement._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{achievement.awardTitle}</h4>
                      <p className="text-sm text-gray-600">{achievement.student?.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No pending approvals</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/admin/activities'}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
          >
            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
            <div className="font-medium text-blue-900">Create Activity</div>
            <div className="text-sm text-blue-700">Add new extracurricular activity</div>
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/students'}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
          >
            <Users className="h-6 w-6 text-green-600 mb-2" />
            <div className="font-medium text-green-900">Manage Students</div>
            <div className="text-sm text-green-700">View and manage student accounts</div>
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/achievements'}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
          >
            <Trophy className="h-6 w-6 text-purple-600 mb-2" />
            <div className="font-medium text-purple-900">Review Achievements</div>
            <div className="text-sm text-purple-700">Approve pending achievements</div>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminOverview />} />
      <Route path="/activities" element={<AdminActivities />} />
      <Route path="/achievements" element={<AdminAchievements />} />
      <Route path="/students" element={<AdminStudents />} />
    </Routes>
  );
};

export default AdminDashboard;