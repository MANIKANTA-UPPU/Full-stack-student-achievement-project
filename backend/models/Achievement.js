const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student reference is required']
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: false
  },
  awardTitle: {
    type: String,
    required: [true, 'Award title is required'],
    trim: true,
    maxlength: [100, 'Award title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  position: {
    type: String,
    enum: ['1st', '2nd', '3rd', 'Participation', 'Winner', 'Runner-up', 'Special Recognition'],
    default: 'Participation'
  },
  certificateUrl: {
    type: String,
    default: ''
  },
  proofDocument: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: {
    type: String,
    maxlength: [200, 'Remarks cannot exceed 200 characters']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  isHighlighted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
achievementSchema.index({ student: 1, status: 1 });
achievementSchema.index({ activity: 1 });
achievementSchema.index({ createdAt: -1 });

// Virtual for achievement age
achievementSchema.virtual('achievementAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Achievement', achievementSchema);