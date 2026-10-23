# 🎓 Student Records System — MERN Stack

A full-stack web application for managing student records, built with **MongoDB, Express.js, React.js, and Node.js (MERN)**.

---

## 📋 Features

- ✅ **Home Page** — Landing page with feature showcase and MERN stack info
- ✅ **User Authentication** — Register/Login with JWT + bcrypt
- ✅ **Data Display Page** — Sortable, searchable student records table
- ✅ **Full CRUD Operations** — Add, Edit, View, and Delete students
- ✅ **Dashboard** — Real-time analytics with Chart.js (doughnut + bar charts)
- ✅ **MongoDB Integration** — Full Mongoose ODM with aggregation pipelines
- ✅ **Responsive Design** — Mobile-first dark-themed UI
- ✅ **Search & Filter** — Search by name/ID/email, filter by dept/status/year
- ✅ **Pagination** — Server-side paginated results
- ✅ **Role-based Access** — Admin / Teacher / Viewer roles

---

## 🛠️ Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | React.js 18, React Router v6 |
| Backend   | Node.js, Express.js |
| Database  | MongoDB + Mongoose |
| Auth      | JWT + bcryptjs |
| Charts    | Chart.js + react-chartjs-2 |
| UI        | Custom CSS (Dark Theme) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm v8+

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/student-records-mern.git
cd student-records-mern
```

### 2. Install dependencies

```bash
# Install all (root, server, client)
npm run install-all
```

### 3. Configure environment

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/studentrecords
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
```

### 4. Run the application

```bash
# Run both server & client simultaneously
npm run dev
```

Or separately:
```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 3000)
cd client && npm start
```

### 5. Open in browser
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000

---

## 📁 Project Structure

```
student-records-mern/
├── server/                  # Node.js + Express backend
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── middleware/
│   │   └── auth.js         # JWT auth middleware
│   ├── models/
│   │   ├── User.js         # User model (bcrypt)
│   │   └── Student.js      # Student model
│   ├── routes/
│   │   ├── auth.js         # Auth routes (register/login)
│   │   └── students.js     # Student CRUD routes
│   ├── .env                # Environment variables
│   └── index.js            # Express app entry
│
├── client/                  # React.js frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js    # Axios API client
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── StudentFormModal.js
│   │   │   └── ConfirmDialog.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── StudentsPage.js
│   │   │   └── StudentDetailPage.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── .gitignore
├── package.json             # Root scripts (concurrently)
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Route               | Description         |
|--------|---------------------|---------------------|
| POST   | /api/auth/register  | Register user       |
| POST   | /api/auth/login     | Login user          |
| GET    | /api/auth/me        | Get current user    |

### Students (Protected)
| Method | Route                  | Description            |
|--------|------------------------|------------------------|
| GET    | /api/students          | Get all (search/page)  |
| GET    | /api/students/stats    | Get statistics         |
| GET    | /api/students/:id      | Get single student     |
| POST   | /api/students          | Create student         |
| PUT    | /api/students/:id      | Update student         |
| DELETE | /api/students/:id      | Delete student         |

---

## 👤 Demo Credentials

After registering an account, you can log in using:
- **Email**: (whatever you registered with)
- **Password**: (your password)

Or use the demo fill button on the login page.

---

## 📸 Pages

1. **Home** — Landing page with hero, features, MERN stack info
2. **Register** — Create account with role selection
3. **Login** — Sign in with email/password
4. **Dashboard** — Stats cards + Chart.js analytics
5. **Students** — Full CRUD table with search, filter, pagination
6. **Student Detail** — View complete student profile

---

## 📝 License

MIT License — Feel free to use for educational purposes.
