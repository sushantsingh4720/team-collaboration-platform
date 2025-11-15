# 🚀 Team Project & Task Management System

A full-stack collaborative platform with **project management, Kanban-based tasks, real-time messaging, and role-based access control**.  
Designed for teams to plan, track, and communicate efficiently.

---

## 🌍 Live Links

| Service | Link |
|---------|------|
| Frontend | <YOUR_FRONTEND_URL> |
| Backend API | <YOUR_BACKEND_URL> |
| Demo Video | <YOUR_VIDEO_LINK> |

---

## 🎥 Demo Requirements Covered

- Login and Registration (Firebase)
- Role-based dashboard (Admin, Manager, Member)
- Creating, editing and deleting projects (permissions applied)
- Full task management with Kanban drag-and-drop
- Assigning users and updating status
- Real-time team chat using Socket.IO
- Assistant workflow demo
- Responsive UI with dark mode

---

## ✨ Features

### 🔐 Authentication & Roles
- Firebase authentication
- Role-based permissions (Admin, Manager, Member)
- Protected routes and actions

### 📁 Project Management
- Create, edit and delete projects
- View project details by team

### 📌 Task Management (Kanban)
- Create, assign and update tasks
- Drag and drop board using React-Beautiful-DnD
- Status categories: **todo, in-progress, done**

### 💬 Real-Time Chat
- Socket.IO live messaging per team
- Message timestamps and context

### 🤖 Assistant Integration
- Helps users improve task titles, clarity and assignment suggestions

---

## 🏗 Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS + Shadcn UI
- Firebase Authentication
- React Beautiful DnD

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- Joi validation

### Deployment
- Frontend → Vercel / Netlify
- Backend → Render / Railway
- Database → MongoDB Atlas

---

## 🗃 Database Schema

### User
| Field | Type | Notes |
|--------|---------|----------------------------|
| id | ObjectId | Primary Key |
| email | String | Required, unique |
| name | String | Required |
| role | Enum(`ADMIN`, `MANAGER`, `MEMBER`) | Required |
| teamId | ObjectId | References Team |

### Team
| Field | Type |
|--------|---------|
| id | ObjectId |
| name | String |
| description | String |
| adminId | ObjectId |

### Project
| Field | Type |
|--------|---------|
| id | ObjectId |
| name | String |
| description | String |
| teamId | ObjectId |

### Task
| Field | Type |
|--------|---------|
| id | ObjectId |
| title | String |
| description | String |
| status | Enum(`todo`, `in-progress`, `done`) |
| projectId | ObjectId |
| assignedTo | ObjectId |

### Message
| Field | Type |
|--------|---------|
| id | ObjectId |
| content | String |
| senderId | ObjectId |
| teamId | ObjectId |
| timestamp | Date |

---

## 🔗 API Endpoints

### Projects
| Method | Endpoint | Access |
|--------|---------------------|----------------|
| GET | `/api/projects` | Team users |
| POST | `/api/projects` | Admin/Manager |
| PUT | `/api/projects/:id` | Admin/Manager |
| DELETE | `/api/projects/:id` | Admin |

### Tasks
| Method | Endpoint | Access |
|--------|---------------------|----------------|
| GET | `/api/tasks?projectId=:id` | Team users |
| POST | `/api/tasks` | Team users |
| PUT | `/api/tasks/:id` | Team users |
| DELETE | `/api/tasks/:id` | Admin/Manager |

### Messages
| Method | Endpoint | Access |
|--------|---------------------|----------------|
| POST | `/api/messages` | Team users |
| GET | `/api/messages` | Team users |

---

## 🛠 Setup Instructions

### 📌 Requirements
- Node.js v18+
- MongoDB Atlas or Local MongoDB
- Firebase Project

---

### Backend Setup

```bash
cd backend
npm install
