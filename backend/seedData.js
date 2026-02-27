const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Activity = require('./models/Activity');
const Achievement = require('./models/Achievement');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_achievements')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Teacher.deleteMany({});
    await Activity.deleteMany({});
    await Achievement.deleteMany({});

    // Create sample users
    console.log('👥 Creating sample users...');
    
    const hashedPassword = await bcrypt.hash('Password123!', 12);
    
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isApproved: true
      },
      {
        name: 'John Doe',
        email: 'john.doe@student.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Computer Science',
        year: 2,
        skills: ['JavaScript', 'Python', 'React'],
        interests: ['Web Development', 'AI/ML']
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@student.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Mechanical',
        year: 3,
        skills: ['CAD', 'MATLAB', '3D Printing'],
        interests: ['Robotics', 'Automotive']
      },
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@student.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Electrical',
        year: 1,
        skills: ['Circuit Design', 'Arduino'],
        interests: ['IoT', 'Embedded Systems']
      }
    ]);

    // Create sample teachers
    console.log('👨🏫 Creating sample teachers...');
    
    const teachers = await Teacher.create([
      {
        name: 'Dr. Robert Wilson',
        email: 'robert.wilson@university.edu',
        field: 'Computer Science',
        department: 'Computer Science',
        phone: '1234567890',
        designation: 'Professor'
      },
      {
        name: 'Dr. Sarah Davis',
        email: 'sarah.davis@university.edu',
        field: 'Mechanical',
        department: 'Mechanical',
        phone: '1234567891',
        designation: 'Associate Professor'
      },
      {
        name: 'Dr. Michael Brown',
        email: 'michael.brown@university.edu',
        field: 'Electrical',
        department: 'Electrical',
        phone: '1234567892',
        designation: 'Assistant Professor'
      },
      {
        name: 'Prof. Lisa Anderson',
        email: 'lisa.anderson@university.edu',
        field: 'General',
        department: 'General',
        phone: '1234567893',
        designation: 'Professor'
      }
    ]);

    // Create sample activities
    console.log('📅 Creating sample activities...');
    
    const adminUser = users.find(u => u.role === 'admin');
    
    const activities = await Activity.create([
      {
        title: 'Annual Programming Contest',
        description: 'Competitive programming contest for all computer science students',
        category: 'Technical',
        field: 'Computer Science',
        assignedTeacher: teachers.find(t => t.field === 'Computer Science')._id,
        createdBy: adminUser._id,
        eventDate: new Date('2024-03-15'),
        venue: 'Computer Lab A',
        maxParticipants: 50,
        tags: ['programming', 'contest', 'coding']
      },
      {
        title: 'Robotics Workshop',
        description: 'Hands-on workshop on building and programming robots',
        category: 'Technical',
        field: 'Mechanical',
        assignedTeacher: teachers.find(t => t.field === 'Mechanical')._id,
        createdBy: adminUser._id,
        eventDate: new Date('2024-03-20'),
        venue: 'Mechanical Workshop',
        maxParticipants: 30,
        tags: ['robotics', 'workshop', 'hands-on']
      },
      {
        title: 'Circuit Design Competition',
        description: 'Design innovative circuits for real-world applications',
        category: 'Technical',
        field: 'Electrical',
        assignedTeacher: teachers.find(t => t.field === 'Electrical')._id,
        createdBy: adminUser._id,
        eventDate: new Date('2024-03-25'),
        venue: 'Electronics Lab',
        maxParticipants: 25,
        tags: ['circuits', 'design', 'electronics']
      },
      {
        title: 'Inter-College Sports Meet',
        description: 'Annual sports competition between colleges',
        category: 'Sports',
        field: 'General',
        assignedTeacher: teachers.find(t => t.field === 'General')._id,
        createdBy: adminUser._id,
        eventDate: new Date('2024-04-01'),
        venue: 'Sports Complex',
        maxParticipants: 100,
        tags: ['sports', 'competition', 'inter-college']
      },
      {
        title: 'Cultural Fest Performance',
        description: 'Showcase your talents in music, dance, and drama',
        category: 'Cultural',
        field: 'General',
        assignedTeacher: teachers.find(t => t.field === 'General')._id,
        createdBy: adminUser._id,
        eventDate: new Date('2024-04-10'),
        venue: 'Auditorium',
        maxParticipants: 0, // Unlimited
        tags: ['cultural', 'performance', 'arts']
      }
    ]);

    // Create sample achievements
    console.log('🏆 Creating sample achievements...');
    
    const students = users.filter(u => u.role === 'student');
    
    await Achievement.create([
      {
        student: students[0]._id, // John Doe
        activity: activities[0]._id, // Programming Contest
        awardTitle: 'First Place - Programming Contest',
        description: 'Solved all problems correctly in minimum time',
        position: '1st',
        status: 'approved',
        approvedBy: adminUser._id,
        approvedAt: new Date(),
        points: 100
      },
      {
        student: students[1]._id, // Jane Smith
        activity: activities[1]._id, // Robotics Workshop
        awardTitle: 'Best Innovation Award',
        description: 'Created an innovative robot design for waste management',
        position: 'Winner',
        status: 'approved',
        approvedBy: adminUser._id,
        approvedAt: new Date(),
        points: 80
      },
      {
        student: students[2]._id, // Alice Johnson
        activity: activities[2]._id, // Circuit Design
        awardTitle: 'Outstanding Design Award',
        description: 'Designed an efficient power management circuit',
        position: '2nd',
        status: 'pending',
        points: 70
      },
      {
        student: students[0]._id, // John Doe
        activity: activities[3]._id, // Sports Meet
        awardTitle: 'Participation Certificate',
        description: 'Participated in 100m sprint and relay race',
        position: 'Participation',
        status: 'approved',
        approvedBy: adminUser._id,
        approvedAt: new Date(),
        points: 20
      },
      {
        student: students[1]._id, // Jane Smith
        activity: activities[4]._id, // Cultural Fest
        awardTitle: 'Best Dancer Award',
        description: 'Exceptional performance in classical dance',
        position: '1st',
        status: 'pending',
        points: 90
      }
    ]);

    console.log('✅ Sample data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@example.com / Password123!');
    console.log('Student 1: john.doe@student.edu / Password123!');
    console.log('Student 2: jane.smith@student.edu / Password123!');
    console.log('Student 3: alice.johnson@student.edu / Password123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();