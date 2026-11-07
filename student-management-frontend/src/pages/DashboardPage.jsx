import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  Plus,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import studentService from '../api/studentService';
import { getErrorMessage } from '../api/axiosConfig';
import StatCard from '../components/dashboard/StatCard';
import CourseDistribution from '../components/dashboard/CourseDistribution';
import StudentTable from '../components/students/StudentTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import { useNotification } from '../context/useNotification';

export const DashboardPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { notifySuccess, notifyError } = useNotification();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      const msg = getErrorMessage(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await studentService.getAllStudents();
        if (isMounted) {
          setStudents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(studentToDelete.id);
      notifySuccess(`Student "${studentToDelete.name}" was successfully removed.`);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      setStudentToDelete(null);
    } catch (err) {
      const msg = getErrorMessage(err);
      notifyError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculations for dashboard metrics
  const totalStudents = students.length;

  const uniqueCourses = new Set(
    students.map((s) => s.course).filter(Boolean)
  ).size;

  const averageAge =
    totalStudents > 0
      ? (
          students.reduce((sum, s) => sum + (Number(s.age) || 0), 0) /
          totalStudents
        ).toFixed(1)
      : 0;

  // Recent 5 students
  const recentStudents = [...students].slice(-5).reverse();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-medium backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Management Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Management Dashboard
          </h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            Live overview of all enrolled students, academic courses, and student records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchStudents}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition backdrop-blur-xs disabled:opacity-50"
            title="Refresh student data"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/students/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-semibold text-sm rounded-2xl shadow-lg transition transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Add New Student
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Failed to load data</h4>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchStudents}
            className="px-3 py-1.5 text-xs font-medium bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Students"
          value={loading ? '...' : totalStudents}
          subtitle="Currently enrolled in database"
          icon={Users}
          colorScheme="indigo"
        />
        <StatCard
          title="Active Programs"
          value={loading ? '...' : uniqueCourses}
          subtitle="Distinct academic courses"
          icon={BookOpen}
          colorScheme="purple"
        />
        <StatCard
          title="Average Age"
          value={loading ? '...' : `${averageAge} yrs`}
          subtitle="Across all student records"
          icon={Calendar}
          colorScheme="emerald"
        />
      </div>

      {/* Dashboard Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Students */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recently Registered Students</h2>
              <p className="text-xs text-slate-500">Latest students added to the system</p>
            </div>
            <Link
              to="/students"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 group"
            >
              <span>View All ({totalStudents})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200">
              <LoadingSpinner message="Loading student records..." />
            </div>
          ) : recentStudents.length > 0 ? (
            <StudentTable
              students={recentStudents}
              onDelete={(student) => setStudentToDelete(student)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No students found yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Get started by creating your first student record.
              </p>
              <Link
                to="/students/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Student
              </Link>
            </div>
          )}
        </div>

        {/* Right 1 Col: Course Distribution & System Quick Status */}
        <div className="space-y-6">
          <CourseDistribution students={students} />

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm">Portal Information</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">System</span>
                <span className="font-semibold text-slate-800">StudentHub Management</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Developer</span>
                <span className="font-semibold text-indigo-600">Softspark Team</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Done Date</span>
                <span className="font-medium text-slate-700">November 07, 2026</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Status</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Delete Student Record"
        message={
          studentToDelete ? (
            <span>
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 font-semibold">{studentToDelete.name}</strong>{' '}
              ({studentToDelete.email})? This action cannot be undone.
            </span>
          ) : (
            ''
          )
        }
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
};

export default DashboardPage;
