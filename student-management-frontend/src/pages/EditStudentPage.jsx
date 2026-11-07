import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import StudentForm from '../components/students/StudentForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import studentService from '../api/studentService';
import { getErrorMessage } from '../api/axiosConfig';
import { useNotification } from '../context/useNotification';

export const EditStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifySuccess } = useNotification();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  // Load existing student data
  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setGeneralError(null);
      try {
        const data = await studentService.getStudentById(id);
        setStudent(data);
      } catch (err) {
        console.error('Failed to load student for edit:', err);
        const msg = getErrorMessage(err);
        setGeneralError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  const handleUpdateStudent = async (studentData) => {
    setIsSubmitting(true);
    setBackendErrors({});
    setGeneralError(null);

    try {
      const updated = await studentService.updateStudent(id, studentData);
      notifySuccess(`Student "${updated.name || studentData.name}" was updated successfully!`);
      navigate('/students');
    } catch (err) {
      console.error('Failed to update student:', err);

      // Check for validation errors returned from Spring Boot
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        const data = err.response.data;

        // Spring Boot duplicate email / conflict error
        if (err.response.status === 409 || data.message?.toLowerCase().includes('email')) {
          setBackendErrors({ email: data.message || 'Email already exists in system' });
          setGeneralError(data.message || 'Another student is already using this email.');
          return;
        }

        // Spring Boot validation errors: Map<String, String>
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
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Edit Student Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Update record details for student ID #{id}.
              </p>
            </div>
          </div>

          <Link
            to="/students"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            title="Back to students list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold">Notice</p>
              <p className="mt-0.5 text-rose-700">{generalError}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="py-12">
              <LoadingSpinner message="Fetching student information..." />
            </div>
          ) : student ? (
            <StudentForm
              key={student.id}
              initialValues={student}
              onSubmit={handleUpdateStudent}
              isSubmitting={isSubmitting}
              backendErrors={backendErrors}
              isEdit={true}
            />
          ) : (
            <div className="text-center py-10 space-y-3">
              <p className="text-sm font-semibold text-slate-800">Student not found</p>
              <p className="text-xs text-slate-500">
                Could not find a student matching ID #{id}.
              </p>
              <Link
                to="/students"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                Back to All Students
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditStudentPage;
