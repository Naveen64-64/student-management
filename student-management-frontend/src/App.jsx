import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/StudentListPage';
import AddStudentPage from './pages/AddStudentPage';
import EditStudentPage from './pages/EditStudentPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* Students list */}
        <Route path="students" element={<StudentListPage />} />

        {/* Add Student */}
        <Route path="students/new" element={<AddStudentPage />} />

        {/* Edit Student */}
        <Route path="students/edit/:id" element={<EditStudentPage />} />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
