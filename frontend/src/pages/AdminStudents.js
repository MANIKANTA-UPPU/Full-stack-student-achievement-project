import React, { useState, useEffect } from 'react';
import { usersAPI, achievementsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Users, Search, Eye, X, Award } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await usersAPI.getUsers({ role: 'student' });
      setStudents(response.data.users || []);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const viewStudentDetails = async (student) => {
    setSelectedStudent(student);
    try {
      const response = await achievementsAPI.getAchievements({ student: student._id });
      setStudentAchievements(response.data.achievements || []);
    } catch (error) {
      toast.error('Failed to load student achievements');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-green-600" />
            Student Management
          </h1>
          <p className="text-gray-600 mt-1">View and manage student accounts</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.department || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.year ? `Year ${student.year}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => viewStudentDetails(student)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Student Info */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedStudent.name}</p>
                      <p><strong>Email:</strong> {selectedStudent.email}</p>
                      <p><strong>Department:</strong> {selectedStudent.department || 'N/A'}</p>
                      <p><strong>Year:</strong> {selectedStudent.year || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Joined:</strong> {new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
                      <p><strong>Role:</strong> Student</p>
                    </div>
                  </div>
                </div>

                {/* Skills & Interests */}
                {(selectedStudent.skills?.length > 0 || selectedStudent.interests?.length > 0) && (
                  <div className="mb-6">
                    {selectedStudent.skills?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedStudent.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedStudent.interests?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedStudent.interests.map((interest, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Achievements */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements ({studentAchievements.length})
                  </h3>
                  {studentAchievements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No achievements yet</p>
                  ) : (
                    <div className="space-y-3">
                      {studentAchievements.map((achievement) => (
                        <div key={achievement._id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{achievement.awardTitle}</h4>
                              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                              {achievement.position && (
                                <p className="text-xs text-gray-500 mt-1">Position: {achievement.position}</p>
                              )}
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              achievement.status === 'approved' ? 'bg-green-100 text-green-800' :
                              achievement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {achievement.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
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

export default AdminStudents;
