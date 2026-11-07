# Student Management System - Frontend

A modern, responsive, and beginner-friendly **Student Management Dashboard** built with **React.js (React 19)**, **Vite 8**, **Tailwind CSS v4**, **Axios**, and **React Router DOM v7**.

Connected directly to a Java Spring Boot REST API backend (`http://localhost:8080/api/students`).

---

## 🚀 Features

- **📊 Dashboard Overview**:
  - Live metric cards: Total enrolled students count, distinct academic courses, and average student age.
  - Course enrollment distribution bars.
  - Recent students quick-access table.
  - Backend integration status ping.

- **📋 Students Directory**:
  - Full student table with avatar badges, course badges, and contact details.
  - **Live Search**: Instant real-time filtering by student name, email, course, or phone number.
  - **Course Filter**: Filter students by specific academic course.
  - **Responsive Design**: Clean desktop table view and dedicated mobile card grid for smaller screens.

- **➕ Add Student**:
  - Validated form fields matching Spring Boot backend constraints:
    - **Name**: 2-100 characters.
    - **Email**: Valid email format, duplicate detection.
    - **Age**: 16-100.
    - **Course**: Select from popular programs or custom input.
    - **Phone**: Exactly 10 digits (`^[0-9]{10}$`).
  - Real-time client-side feedback and backend validation error mapping (Spring Boot 400 Bad Request & 409 Conflict).

- **✏️ Edit Student**:
  - Pre-filled form with current student details.
  - Updates saved seamlessly to backend (`PUT /api/students/{id}`).

- **🗑️ Delete Student with Confirmation**:
  - Modal confirmation dialog prevents accidental deletion.
  - Real-time removal from state on success.

- **🔔 Toast Notification System**:
  - Floating alerts for success, info, and error notifications.
  - Auto-dismissing with manual dismiss controls.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with centralized error formatting and interceptors
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans (Google Fonts)

---

## 📁 Project Structure

```
student-management-frontend/
├── src/
│   ├── api/
│   │   ├── axiosConfig.js            # Axios client, baseURL, & Spring Boot error parser
│   │   └── studentService.js         # Student CRUD API functions
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx             # Top sticky navbar with backend status badge
│   │   │   ├── Sidebar.jsx            # Desktop sidebar & mobile navigation drawer
│   │   │   ├── ConfirmModal.jsx       # Delete confirmation modal dialog
│   │   │   ├── EmptyState.jsx         # Visual empty state illustration & action button
│   │   │   └── LoadingSpinner.jsx     # Spinner & table skeleton loaders
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx           # Metric stat cards (Total Students, Courses, Age)
│   │   │   └── CourseDistribution.jsx # Visual course enrollment breakdown
│   │   └── students/
│   │       ├── StudentForm.jsx        # Reusable Add/Edit form with validation
│   │       ├── StudentTable.jsx       # Desktop data table with action buttons
│   │       └── StudentCard.jsx        # Mobile-optimized card layout
│   ├── context/
│   │   ├── notificationContext.js     # React Context definition
│   │   ├── NotificationProvider.jsx   # Global Toast provider
│   │   └── useNotification.js         # Custom hook for trigger notifications
│   ├── layouts/
│   │   └── MainLayout.jsx             # Layout shell (Sidebar + Navbar + Content Outlet)
│   ├── pages/
│   │   ├── DashboardPage.jsx          # Dashboard with stats, recent students, & actions
│   │   ├── StudentListPage.jsx        # Searchable student directory & deletion
│   │   ├── AddStudentPage.jsx         # Add student page
│   │   ├── EditStudentPage.jsx        # Edit student page
│   │   └── NotFoundPage.jsx           # 404 Not Found page
│   ├── App.jsx                        # React Router configuration
│   ├── index.css                      # Tailwind CSS v4 setup
│   └── main.jsx                       # App entry point
├── .env                               # Backend API URL configuration
├── vite.config.js                     # Vite configuration with proxy to port 8080
└── package.json
```

---

## 🔌 Backend API Integration

The frontend connects directly to your Spring Boot REST API:

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all students |
| `GET` | `/api/students/{id}` | Get student by ID |
| `POST` | `/api/students` | Create a new student |
| `PUT` | `/api/students/{id}` | Update student by ID |
| `DELETE` | `/api/students/{id}` | Delete student by ID |

### 💡 Zero-CORS Setup via Vite Proxy
Because Spring Boot runs on `http://localhost:8080` without modifying backend files, `vite.config.js` is configured with a dev server proxy:
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```
All API requests sent to `/api/students` are transparently forwarded to `http://localhost:8080/api/students`, bypassing browser CORS issues completely!

---

## 🏃 Getting Started

### 1. Start the Java Spring Boot Backend
Ensure your Spring Boot backend application is running:
- Port: `8080`
- MySQL Database running and connected

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
