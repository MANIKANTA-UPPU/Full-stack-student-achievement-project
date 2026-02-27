# 📚 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "student",
  "department": "Computer Science",
  "year": 2,
  "recaptchaToken": "optional_in_development"
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!",
  "recaptchaToken": "optional_in_development"
}
```

### Get Current User
```http
GET /auth/me
```
*Requires authentication*

## 👥 Users Endpoints

### Get All Users (Admin Only)
```http
GET /users?role=student&department=Computer Science
```

### Approve User (Admin Only)
```http
PUT /users/:id/approve
```

## 📅 Activities Endpoints

### Get Activities
```http
GET /activities?page=1&limit=10&category=Sports&field=Computer Science
```

### Get Single Activity
```http
GET /activities/:id
```

### Create Activity (Admin Only)
```http
POST /activities
```

**Request Body:**
```json
{
  "title": "Programming Contest",
  "description": "Annual coding competition",
  "category": "Technical",
  "field": "Computer Science",
  "assignedTeacher": "teacher_id",
  "eventDate": "2024-03-15",
  "venue": "Computer Lab",
  "maxParticipants": 50,
  "tags": ["programming", "contest"]
}
```

### Update Activity (Admin Only)
```http
PUT /activities/:id
```

### Delete Activity (Admin Only)
```http
DELETE /activities/:id
```

### Get Teachers by Field (Admin Only)
```http
GET /activities/teachers/:field
```

## 🏆 Achievements Endpoints

### Get Achievements
```http
GET /achievements?page=1&limit=10&status=pending&student=student_id
```

### Create Achievement
```http
POST /achievements
```

**Request Body:**
```json
{
  "activity": "activity_id",
  "awardTitle": "First Place",
  "description": "Won first place in programming contest",
  "position": "1st"
}
```

### Update Achievement Status (Admin Only)
```http
PUT /achievements/:id/status
```

**Request Body:**
```json
{
  "status": "approved",
  "remarks": "Excellent performance!"
}
```

### Get Achievement Statistics
```http
GET /achievements/stats
```

## 👨‍🏫 Teachers Endpoints

### Get All Teachers
```http
GET /teachers
```

### Create Teacher (Admin Only)
```http
POST /teachers
```

**Request Body:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane.smith@university.edu",
  "field": "Computer Science",
  "department": "Computer Science",
  "phone": "1234567890",
  "designation": "Professor"
}
```

### Update Teacher (Admin Only)
```http
PUT /teachers/:id
```

## 📊 Reports Endpoints

### Get Dashboard Data (Admin Only)
```http
GET /reports/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalStudents": 150,
      "totalActivities": 25,
      "totalAchievements": 300,
      "pendingApprovals": 15
    },
    "fieldStats": [
      { "_id": "Computer Science", "count": 10 },
      { "_id": "Mechanical", "count": 8 }
    ],
    "categoryStats": [
      { "_id": "Technical", "count": 45 },
      { "_id": "Sports", "count": 30 }
    ]
  }
}
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 🔒 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🎯 Field Values

### Departments/Fields
- Computer Science
- Mechanical
- Electrical
- Civil
- Electronics
- Chemical

### Activity Categories
- Sports
- Cultural
- Technical
- Arts
- Social Service
- Academic
- Leadership

### Achievement Positions
- 1st
- 2nd
- 3rd
- Participation
- Winner
- Runner-up
- Special Recognition

### Achievement Status
- pending
- approved
- rejected