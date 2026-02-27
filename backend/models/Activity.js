const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Sports', 'Cultural', 'Technical', 'Arts', 'Social Service', 'Academic', 'Leadership']
  },
  field: {
    type: String,
    required: [true, 'Field is required'],
    enum: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Chemical', 'General']
  },
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Assigned teacher is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required']
  },
  maxParticipants: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for better query performance
activitySchema.index({ field: 1, category: 1 });
activitySchema.index({ eventDate: 1 });

module.exports = mongoose.model('Activity', activitySchema);