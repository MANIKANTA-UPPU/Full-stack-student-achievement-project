import React, { useState, useEffect } from 'react';
import { activitiesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, Filter, Search, Eye } from 'lucide-react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activitiesAPI.getActivities();
      setActivities(response.data.activities || []);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Sports', 'Cultural', 'Technical', 'Arts', 'Social Service', 'Academic', 'Leadership'];

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.category === filter;
    const matchesSearch = activity.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      Sports: 'bg-blue-100 text-blue-800',
      Cultural: 'bg-purple-100 text-purple-800',
      Technical: 'bg-green-100 text-green-800',
      Arts: 'bg-pink-100 text-pink-800',
      'Social Service': 'bg-yellow-100 text-yellow-800',
      Academic: 'bg-indigo-100 text-indigo-800',
      Leadership: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-green-600" />
            Available Activities
          </h1>
          <p className="text-gray-600 mt-1">Explore and participate in extracurricular activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === category ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Found</h3>
            <p className="text-gray-500">Check back later for new activities!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div key={activity._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                      {activity.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(activity.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{activity.venue}</span>
                    </div>
                    {activity.assignedTeacher && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{activity.assignedTeacher.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setSelectedActivity(activity)}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Detail Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedActivity.category)}`}>
                      {selectedActivity.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedActivity.title}</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedActivity.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Event Date</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedActivity.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Venue</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedActivity.venue}
                      </p>
                    </div>
                  </div>
                  
                  {selectedActivity.assignedTeacher && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Coordinator</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {selectedActivity.assignedTeacher.name} - {selectedActivity.assignedTeacher.field}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Field</h3>
                    <p className="text-gray-600">{selectedActivity.field}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="mt-6 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
