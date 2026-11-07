import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import StudentForm from '../components/students/StudentForm';
import studentService from '../api/studentService';
import { getErrorMessage } from '../api/axiosConfig';
import { useNotification } from '../context/useNotification';

export const AddStudentPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const navigate = useNavigate();
  const { notifySuccess } = useNotification();

  const handleCreateStudent = async (studentData) => {
    setIsSubmitting(true);
    setBackendErrors({});
    setGeneralError(null);

    try {
      const created = await studentService.createStudent(studentData);
      notifySuccess(`Student "${created.name || studentData.name}" was added successfully!`);
      navigate('/students');
    } catch (err) {
      console.error('Failed to create student:', err);

      // Check for validation errors returned from Spring Boot
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        const data = err.response.data;

        // Spring Boot duplicate email / conflict error
        if (err.response.status === 409 || data.message?.toLowerCase().includes('email')) {
          setBackendErrors({ email: data.message || 'Email already exists in system' });
          setGeneralError(data.message || 'A student with this email address is already registered.');
          return;
        }

        // Spring Boot validation errors: Map<String, String> { name: "...", phone: "..." }
        if (err.response.status === 400 && !data.message) {
          setBackendErrors(data);
          setGeneralError('Please resolve the errors highlighted below.');
          return;
        }
      }

      const msg = getErrorMessage(err);
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Add New Student
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fill in the details below to enroll a new student into the portal.
            </p>
          </div>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold">Unable to save student</p>
              <p className="mt-0.5 text-rose-700">{generalError}</p>
            </div>
          </div>
        )}

        {/* Student Form */}
        <div className="mt-8">
          <StudentForm
            onSubmit={handleCreateStudent}
            isSubmitting={isSubmitting}
            backendErrors={backendErrors}
            isEdit={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AddStudentPage;
