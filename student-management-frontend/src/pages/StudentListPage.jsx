import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  RefreshCw,
  Users,
  X,
  AlertCircle,
  Filter,
} from 'lucide-react';
import studentService from '../api/studentService';
import { getErrorMessage } from '../api/axiosConfig';
import StudentTable from '../components/students/StudentTable';
import StudentCard from '../components/students/StudentCard';
import { TableSkeleton } from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import { useNotification } from '../context/useNotification';

export const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
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
      console.error('Failed to load students:', err);
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

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(studentToDelete.id);
      notifySuccess(`Student "${studentToDelete.name}" was deleted successfully.`);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      setStudentToDelete(null);
    } catch (err) {
      const msg = getErrorMessage(err);
      notifyError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Distinct courses for filtering
  const availableCourses = useMemo(() => {
    const courses = new Set();
    students.forEach((s) => {
      if (s.course) courses.add(s.course);
    });
    return Array.from(courses).sort();
  }, [students]);

  // Filtered students by search query (name, email, course, phone) and course filter
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (student.name && student.name.toLowerCase().includes(q)) ||
        (student.email && student.email.toLowerCase().includes(q)) ||
        (student.course && student.course.toLowerCase().includes(q)) ||
        (student.phone && student.phone.includes(q));

      const matchesCourse =
        selectedCourse === 'ALL' || student.course === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [students, searchQuery, selectedCourse]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Students Directory</span>
            {!loading && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {students.length} Total
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, search, edit, and manage all enrolled students in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchStudents}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition shadow-xs disabled:opacity-50"
            title="Refresh list"
            aria-label="Refresh student list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/students/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Failed to load students</h4>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchStudents}
            className="px-3 py-1.5 text-xs font-medium bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by student name, email, course, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-slate-900 bg-slate-50/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter by Course */}
        {availableCourses.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline-block" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            >
              <option value="ALL">All Courses ({students.length})</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results counter when searching */}
      {(searchQuery || selectedCourse !== 'ALL') && !loading && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Found <strong className="text-slate-800">{filteredStudents.length}</strong> matching{' '}
            {filteredStudents.length === 1 ? 'student' : 'students'}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCourse('ALL');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Student Content */}
      {loading ? (
        <div className="space-y-4">
          <TableSkeleton rows={6} />
        </div>
      ) : filteredStudents.length > 0 ? (
        <>
          {/* Desktop Table View (md and above) */}
          <div className="hidden md:block">
            <StudentTable
              students={filteredStudents}
              onDelete={(student) => setStudentToDelete(student)}
            />
          </div>

          {/* Mobile Card View (below md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onDelete={(s) => setStudentToDelete(s)}
              />
            ))}
          </div>
        </>
      ) : students.length > 0 ? (
        // Filter returned no results
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 text-base">No Matching Students</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No students found matching your criteria "{searchQuery}". Try searching by another keyword.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCourse('ALL');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
          >
            Clear Search
          </button>
        </div>
      ) : (
        // Database is completely empty
        <EmptyState
          icon={Users}
          title="No Students Registered Yet"
          description="There are currently no student records in the portal. Add your first student to get started!"
          actionText="Add First Student"
          actionLink="/students/new"
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Delete Student Record"
        message={
          studentToDelete ? (
            <span>
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 font-semibold">{studentToDelete.name}</strong>?
              This will remove their profile from the database.
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

export default StudentListPage;
