import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { achievementsAPI, activitiesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Award, Plus, X, Filter, Search, Download, Clock, CheckCircle, XCircle } from 'lucide-react';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    awardTitle: '',
    description: '',
    position: '',
    certificateUrl: ''
  });

  useEffect(() => {
    fetchAchievements();
    fetchActivities();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await achievementsAPI.getAchievements();
      setAchievements(response.data.achievements || []);
    } catch (error) {
      toast.error('Failed to load achievements');
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await activitiesAPI.getActivities();
      setActivities(response.data.activities || []);
    } catch (error) {
      console.error('Failed to load activities');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await achievementsAPI.createAchievement(formData);
      toast.success('Achievement submitted for approval!');
      setShowModal(false);
      setFormData({ awardTitle: '', description: '', position: '', certificateUrl: '' });
      fetchAchievements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit achievement');
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesFilter = filter === 'all' || achievement.status === filter;
    const matchesSearch = achievement.awardTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-8 h-8 text-green-600" />
                My Achievements
              </h1>
              <p className="text-gray-600 mt-1">Track and manage your achievements</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Achievement
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements List */}
        {filteredAchievements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Achievements Yet</h3>
            <p className="text-gray-500 mb-4">Start participating in activities and add your achievements!</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Add Your First Achievement
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAchievements.map((achievement) => (
              <div key={achievement._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{achievement.awardTitle}</h3>
                      {getStatusBadge(achievement.status)}
                    </div>
                    <p className="text-gray-600 mb-3">{achievement.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Activity: {achievement.activity?.title || 'N/A'}</span>
                      {achievement.position && <span>Position: {achievement.position}</span>}
                      <span>Submitted: {new Date(achievement.createdAt).toLocaleDateString()}</span>
                    </div>
                    {achievement.remarks && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700"><strong>Remarks:</strong> {achievement.remarks}</p>
                      </div>
                    )}
                  </div>
                  {achievement.certificateUrl && (
                    <button className="ml-4 p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Achievement Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Achievement</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Award Title</label>
                    <input
                      type="text"
                      required
                      value={formData.awardTitle}
                      onChange={(e) => setFormData({ ...formData, awardTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., First Prize in Coding Competition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe your achievement..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Position</option>
                      <option value="1st">1st Place</option>
                      <option value="2nd">2nd Place</option>
                      <option value="3rd">3rd Place</option>
                      <option value="Winner">Winner</option>
                      <option value="Runner-up">Runner-up</option>
                      <option value="Participation">Participation</option>
                      <option value="Special Recognition">Special Recognition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.certificateUrl}
                      onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Achievement'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
