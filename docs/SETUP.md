# 🚀 FSAD-SDP-45: Student Achievements Platform Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "full stack project"
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
```bash
# Copy environment template
copy .env.example .env

# Edit .env file with your configuration:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_achievements
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
FRONTEND_URL=http://localhost:3000
```

#### Start MongoDB
```bash
# Windows (if MongoDB is installed as service)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

#### Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Open new terminal and navigate to frontend
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
```bash
# Copy environment template
copy .env.example .env

# Edit .env file:
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

#### Start Frontend Application
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔐 Default Login Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: Admin123!

### Student Account
- **Email**: student@example.com
- **Password**: Student123!

## 📊 Sample Data Setup

### 1. Create Sample Teachers
```javascript
// Run in MongoDB shell or create via API
db.teachers.insertMany([
  {
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    field: "Computer Science",
    department: "Computer Science",
    designation: "Professor"
  },
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    field: "Mechanical",
    department: "Mechanical",
    designation: "Associate Professor"
  }
]);
```

### 2. Create Sample Activities
Use the admin dashboard to create activities or use the API endpoints.

## 🧪 Testing the Application

### 1. Registration Flow
1. Go to `http://localhost:3000/register`
2. Create a student account
3. Login with the credentials
4. Select role on role selection page

### 2. Admin Features
1. Login as admin
2. Create activities
3. Assign teachers to activities
4. Approve/reject student achievements

### 3. Student Features
1. Login as student
2. View dashboard
3. Browse activities
4. Submit achievements

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start
- Check if MongoDB is running
- Verify environment variables
- Check port 5000 is not in use

#### Frontend won't start
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port 3000 is not in use

#### Database connection issues
- Ensure MongoDB service is running
- Check MongoDB URI in .env file
- Verify database permissions

#### CORS errors
- Check FRONTEND_URL in backend .env
- Verify API_URL in frontend .env

## 📱 Features Checklist

### ✅ Implemented Features
- [x] Dual-role authentication (Student/Admin)
- [x] CAPTCHA verification (configurable)
- [x] Professional dashboards
- [x] Field-specific teacher routing
- [x] JWT-based authentication
- [x] Role-based access control
- [x] Responsive design
- [x] Achievement management
- [x] Activity management
- [x] Analytics dashboard

### 🔄 Additional Features (Can be extended)
- [ ] File upload for certificates
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Advanced search and filters
- [ ] Leaderboard system
- [ ] Multi-language support

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set production environment variables
2. Update CORS settings
3. Configure production database
4. Deploy using platform-specific instructions

### Frontend Deployment (Netlify/Vercel)
1. Build the application: `npm run build`
2. Deploy build folder
3. Configure environment variables
4. Set up redirects for SPA

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review console logs for errors
3. Verify all environment variables
4. Ensure all services are running

## 🎯 Project Structure
```
├── backend/              # Node.js + Express API
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
├── frontend/            # React.js Application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── services/    # API services
│   └── public/          # Static files
└── docs/               # Documentation
```

Happy coding! 🎉