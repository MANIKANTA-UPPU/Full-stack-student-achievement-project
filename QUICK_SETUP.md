# 🚀 QUICK SETUP GUIDE - UPGRADED PROJECT

## Prerequisites
- ✅ Node.js installed
- ✅ MongoDB installed and running
- ✅ Git (optional)

---

## 🔥 Quick Start (5 Steps)

### Step 1: Start MongoDB
```bash
net start MongoDB
```

### Step 2: Setup Backend
```bash
cd backend
npm install
npm run seed:superadmin
npm run dev
```

**Output should show:**
```
✅ Super Admin created successfully!
Email: superadmin@example.com
Password: SuperAdmin123!
```

### Step 3: Setup Frontend (New Terminal)
```bash
cd frontend
npm install
npm start
```

### Step 4: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Step 5: Login as Super Admin
```
Email: superadmin@example.com
Password: SuperAdmin123!
Role: Admin (select from dropdown)
```

---

## 👥 Test User Flows

### Flow 1: Student Registration
1. Click "Sign Up"
2. Fill form:
   - Name: Test Student
   - Email: student@test.com
   - Password: Student123!
   - Role: Student
   - Department: Computer Science
   - Year: 2
3. Click "Create Account"
4. **Expected:** Redirected to login page
5. Login with same credentials
6. **Expected:** Access student dashboard

### Flow 2: Admin Registration (Needs Approval)
1. Click "Sign Up"
2. Fill form:
   - Name: Test Admin
   - Email: admin@test.com
   - Password: Admin123!
   - Role: Admin
   - Field: Computer Science
3. Click "Create Account"
4. **Expected:** Message "Pending approval" → Redirect to login
5. Try to login
6. **Expected:** Error "Account pending approval"

### Flow 3: Super Admin Approves Admin
1. Login as Super Admin
2. Go to pending approvals (API or future UI)
3. Approve the admin
4. Admin can now login successfully

---

## 🔑 Default Accounts

### Super Admin
```
Email: superadmin@example.com
Password: SuperAdmin123!
Access: Full system control
```

### Test Student (Create manually)
```
Email: student@test.com
Password: Student123!
Role: Student
```

### Test Admin (Create manually, needs approval)
```
Email: admin@test.com
Password: Admin123!
Role: Admin
Field: Computer Science
```

---

## 🛠️ Troubleshooting

### MongoDB Not Starting
```bash
# Check if MongoDB is installed
mongod --version

# Start MongoDB service
net start MongoDB

# If fails, restart computer and try again
```

### Backend Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

### Frontend Port Already in Use
```bash
# When prompted, press 'Y' to run on different port
# Or kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### CAPTCHA Errors
- CAPTCHA is disabled in development mode
- No action needed for local testing

---

## 📡 API Endpoints (For Testing)

### Authentication
```
POST /api/auth/register - Register user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user
```

### Super Admin (Requires Super Admin Token)
```
GET /api/superadmin/pending-admins - Get pending admins
PUT /api/superadmin/approve-admin/:id - Approve admin
DELETE /api/superadmin/reject-admin/:id - Reject admin
PUT /api/superadmin/toggle-user/:id - Activate/Deactivate user
GET /api/superadmin/all-users - Get all users
GET /api/superadmin/stats - Get system stats
```

### Test with Postman/Thunder Client
```
1. Login as Super Admin
2. Copy the token from response
3. Add header: Authorization: Bearer <token>
4. Test super admin endpoints
```

---

## 🎯 What Works Now

✅ Student signup → Redirect to login
✅ Admin signup → Pending approval → Redirect to login
✅ Super Admin can approve/reject admins
✅ Super Admin can activate/deactivate users
✅ Role-based access control
✅ Field tracking for admins
✅ Account status management
✅ Secure authentication

---

## 📋 What Needs Frontend UI

⏳ Super Admin dashboard pages
⏳ Pending approvals UI
⏳ User management table
⏳ System statistics charts
⏳ Empty state designs
⏳ Professional card layouts

**Backend is 100% ready! Frontend needs UI components.**

---

## 🔄 Restart Services

### Restart Backend
```bash
# In backend terminal
Ctrl + C
npm run dev
```

### Restart Frontend
```bash
# In frontend terminal
Ctrl + C
npm start
```

### Restart MongoDB
```bash
net stop MongoDB
net start MongoDB
```

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Super Admin created successfully
- [ ] Can access login page
- [ ] Student signup works
- [ ] Admin signup shows pending message
- [ ] Super Admin can login

---

**You're all set! 🎉**

For detailed upgrade information, see `UPGRADE_SUMMARY.md`
