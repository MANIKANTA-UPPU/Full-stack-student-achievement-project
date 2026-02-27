# 🎓 Student Extracurricular Achievement Management System

A professional full-stack web application for tracking, managing, and showcasing student extracurricular achievements with role-based authentication and approval workflows.

## 🌟 Features

### 👨‍🎓 Student Portal
- ✅ Submit and track achievements
- ✅ Browse available activities
- ✅ View achievement status (Pending/Approved/Rejected)
- ✅ Professional profile management with photo upload
- ✅ Dashboard with statistics and quick actions

### 👨‍💼 Admin Portal
- ✅ Create and manage activities
- ✅ Approve/reject student achievements
- ✅ View all students and their achievements
- ✅ Dashboard with analytics
- ✅ Add remarks to achievements

### 🛡️ Super Admin Portal
- ✅ Approve/reject admin registrations
- ✅ Manage all system users
- ✅ Activate/deactivate accounts
- ✅ System statistics overview
- ✅ Full administrative control

## 🏗️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── config/          # Configuration
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── layouts/     # Layout components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   └── App.js       # Main app
│   └── public/
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MANIKANTA-UPPU/Full-stack-student-achievement-project.git
cd Full-stack-student-achievement-project
```

2. **Setup Backend**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_achievements
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
FRONTEND_URL=http://localhost:3000
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

4. **Start MongoDB**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

5. **Create Super Admin**
```bash
cd backend
npm run seed:superadmin
```

6. **Run the Application**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

7. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Default Credentials

### Super Admin
```
Email: superadmin@example.com
Password: SuperAdmin123!
```

### Test Accounts
Create your own accounts via the registration page.

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: "student" | "admin" | "superadmin",
  department: String,
  year: Number,
  field: String,
  isApproved: Boolean,
  isActive: Boolean,
  profileImage: String,
  skills: [String],
  interests: [String]
}
```

### Achievements Collection
```javascript
{
  student: ObjectId,
  awardTitle: String,
  description: String,
  position: String,
  certificateUrl: String,
  status: "pending" | "approved" | "rejected",
  remarks: String,
  approvedBy: ObjectId,
  approvedAt: Date
}
```

### Activities Collection
```javascript
{
  title: String,
  description: String,
  category: String,
  field: String,
  eventDate: Date,
  venue: String,
  assignedTeacher: ObjectId,
  status: "active" | "completed"
}
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ Input validation
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Rate limiting

## 🎨 UI/UX Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern glassmorphism effects
- ✅ Smooth animations and transitions
- ✅ Toast notifications
- ✅ Loading states
- ✅ Empty state designs
- ✅ Professional color schemes
- ✅ Intuitive navigation

## 📱 Screenshots

### Role Selection Page
Professional portal selection with animated gradients

### Student Dashboard
Clean dashboard with statistics and quick actions

### Admin Dashboard
Comprehensive admin panel with approval workflows

### Super Admin Dashboard
System administration with user management

## 🛠️ Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server
npm run seed:superadmin  # Create super admin
npm test           # Run tests
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🔄 Workflow

1. **Student Registration** → Auto-approved → Login
2. **Admin Registration** → Pending approval → Super Admin approves → Login
3. **Student submits achievement** → Pending status
4. **Admin reviews achievement** → Approve/Reject with remarks
5. **Student views updated status** → Can see remarks

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Manikanta Uppu**
- GitHub: [@MANIKANTA-UPPU](https://github.com/MANIKANTA-UPPU)

## 🙏 Acknowledgments

- React.js community
- Tailwind CSS team
- MongoDB documentation
- Express.js framework

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy backend

### Frontend Deployment (Vercel/Netlify)
1. Build the project
2. Set environment variables
3. Deploy frontend

## 📈 Future Enhancements

- [ ] Email notifications
- [ ] File upload for certificates
- [ ] Advanced analytics and reports
- [ ] Export data to PDF/Excel
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Mobile app version

---

⭐ Star this repository if you find it helpful!
