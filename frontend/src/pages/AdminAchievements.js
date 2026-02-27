import React, { useState, useEffect } from 'react';
import { achievementsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Award, CheckCircle, XCircle, Clock, Eye, X } from 'lucide-react';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, [filter]);

  const fetchAchievements = async () => {
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const response = await achievementsAPI.getAchievements(params);
      setAchievements(response.data.achievements || []);
    } catch (error) {
      toast.error('Failed to load achievements');
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await achievementsAPI.updateAchievementStatus(id, { 
        status: 'approved',
        remarks: remarks || 'Approved'
      });
      toast.success('Achievement approved!');
      setSelectedAchievement(null);
      setRemarks('');
      fetchAchievements();
    } catch (error) {
      toast.error('Failed to approve achievement');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!remarks.trim()) {
      toast.error('Please provide remarks for rejection');
      return;
    }
    setLoading(true);
    try {
      await achievementsAPI.updateAchievementStatus(id, { 
        status: 'rejected',
        remarks 
      });
      toast.success('Achievement rejected');
      setSelectedAchievement(null);
      setRemarks('');
      fetchAchievements();
    } catch (error) {
      toast.error('Failed to reject achievement');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-8 h-8 text-green-600" />
            Achievement Approvals
          </h1>
          <p className="text-gray-600 mt-1">Review and approve student achievements</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            {['pending', 'approved', 'rejected', 'all'].map((status) => (
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

        {/* Achievements List */}
        {achievements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Achievements</h3>
            <p className="text-gray-500">No {filter} achievements found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <div key={achievement._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{achievement.awardTitle}</h3>
                      {getStatusBadge(achievement.status)}
                    </div>
                    <p className="text-gray-600 mb-3">{achievement.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <strong>Student:</strong> {achievement.student?.name || 'N/A'}
                      </div>
                      <div>
                        <strong>Activity:</strong> {achievement.activity?.title || 'N/A'}
                      </div>
                      {achievement.position && (
                        <div>
                          <strong>Position:</strong> {achievement.position}
                        </div>
                      )}
                      <div>
                        <strong>Submitted:</strong> {new Date(achievement.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {achievement.certificateUrl && (
                      <div className="mt-3">
                        <a 
                          href={achievement.certificateUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Certificate
                        </a>
                      </div>
                    )}
                    {achievement.remarks && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700"><strong>Remarks:</strong> {achievement.remarks}</p>
                      </div>
                    )}
                  </div>
                  {achievement.status === 'pending' && (
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => setSelectedAchievement(achievement)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedAchievement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Review Achievement</h2>
                  <button 
                    onClick={() => {
                      setSelectedAchievement(null);
                      setRemarks('');
                    }} 
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Award Title</h3>
                    <p className="text-gray-600">{selectedAchievement.awardTitle}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Description</h3>
                    <p className="text-gray-600">{selectedAchievement.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Student</h3>
                      <p className="text-gray-600">{selectedAchievement.student?.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Activity</h3>
                      <p className="text-gray-600">{selectedAchievement.activity?.title}</p>
                    </div>
                  </div>

                  {selectedAchievement.position && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Position</h3>
                      <p className="text-gray-600">{selectedAchievement.position}</p>
                    </div>
                  )}

                  {selectedAchievement.certificateUrl && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Certificate</h3>
                      <a 
                        href={selectedAchievement.certificateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Certificate
                      </a>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks (Required for rejection)
                    </label>
                    <textarea
                      rows="3"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Add your remarks here..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedAchievement._id)}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {loading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedAchievement._id)}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    {loading ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAchievements;
