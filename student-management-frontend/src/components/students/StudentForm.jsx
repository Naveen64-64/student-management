import React, { useState } from 'react';
import { User, Mail, BookOpen, Phone, Calendar, Loader2, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const POPULAR_COURSES = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Business Administration',
  'Finance & Accounting',
];

export const StudentForm = ({
  initialValues = {
    name: '',
    email: '',
    age: '',
    course: '',
    phone: '',
  },
  onSubmit,
  isSubmitting = false,
  backendErrors = {},
  isEdit = false,
}) => {
  const [formData, setFormData] = useState(() => ({
    name: initialValues.name || '',
    email: initialValues.email || '',
    age: initialValues.age !== undefined && initialValues.age !== null ? String(initialValues.age) : '',
    course: initialValues.course || '',
    phone: initialValues.phone || '',
  }));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [customCourseMode, setCustomCourseMode] = useState(() => {
    return Boolean(initialValues.course && !POPULAR_COURSES.includes(initialValues.course));
  });

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (value.trim().length > 100) {
          error = 'Name must not exceed 100 characters';
        }
        break;

      case 'email':
        if (!value || !value.trim()) {
          error = 'Email address is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.trim())) {
          error = 'Please provide a valid email address';
        }
        break;

      case 'age': {
        const numAge = Number(value);
        if (value === '' || value === null || value === undefined) {
          error = 'Age is required';
        } else if (isNaN(numAge)) {
          error = 'Age must be a number';
        } else if (numAge < 16) {
          error = 'Age must be at least 16';
        } else if (numAge > 100) {
          error = 'Age must not exceed 100';
        }
        break;
      }

      case 'course':
        if (!value || !value.trim()) {
          error = 'Course enrollment is required';
        }
        break;

      case 'phone':
        if (!value || !value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value.trim())) {
          error = 'Phone must contain exactly 10 digits';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      age: true,
      course: true,
      phone: true,
    });

    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) validationErrors[field] = error;
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: parseInt(formData.age, 10),
        course: formData.course.trim(),
        phone: formData.phone.trim(),
      });
    }
  };

  // Merge local validation errors and backend errors
  const activeErrors = { ...errors, ...backendErrors };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
            Student Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-5 w-5" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Alex Johnson"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border transition focus:outline-none focus:ring-2 ${
                activeErrors.name && (touched.name || backendErrors.name)
                  ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 text-slate-900'
              }`}
            />
          </div>
          {activeErrors.name && (touched.name || backendErrors.name) && (
            <p className="text-xs text-rose-600 font-medium mt-1">{activeErrors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. alex@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border transition focus:outline-none focus:ring-2 ${
                activeErrors.email && (touched.email || backendErrors.email)
                  ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 text-slate-900'
              }`}
            />
          </div>
          {activeErrors.email && (touched.email || backendErrors.email) && (
            <p className="text-xs text-rose-600 font-medium mt-1">{activeErrors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
            Phone Number (10 Digits) <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="h-5 w-5" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border transition focus:outline-none focus:ring-2 ${
                activeErrors.phone && (touched.phone || backendErrors.phone)
                  ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 text-slate-900'
              }`}
            />
          </div>
          {activeErrors.phone && (touched.phone || backendErrors.phone) && (
            <p className="text-xs text-rose-600 font-medium mt-1">{activeErrors.phone}</p>
          )}
        </div>

        {/* Age Field */}
        <div className="space-y-1.5">
          <label htmlFor="age" className="block text-sm font-semibold text-slate-700">
            Age (16 - 100) <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="h-5 w-5" />
            </div>
            <input
              id="age"
              name="age"
              type="number"
              min={16}
              max={100}
              placeholder="e.g. 21"
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border transition focus:outline-none focus:ring-2 ${
                activeErrors.age && (touched.age || backendErrors.age)
                  ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 text-slate-900'
              }`}
            />
          </div>
          {activeErrors.age && (touched.age || backendErrors.age) && (
            <p className="text-xs text-rose-600 font-medium mt-1">{activeErrors.age}</p>
          )}
        </div>

        {/* Course Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="course" className="block text-sm font-semibold text-slate-700">
              Course / Major <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setCustomCourseMode((prev) => !prev);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {customCourseMode ? 'Select from list' : 'Custom course name'}
            </button>
          </div>

          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <BookOpen className="h-5 w-5" />
            </div>

            {customCourseMode ? (
              <input
                id="course"
                name="course"
                type="text"
                placeholder="Enter course name..."
                value={formData.course}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border transition focus:outline-none focus:ring-2 ${
                  activeErrors.course && (touched.course || backendErrors.course)
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 text-slate-900'
                }`}
              />
            ) : (
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border transition focus:outline-none focus:ring-2 ${
                  activeErrors.course && (touched.course || backendErrors.course)
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 text-slate-900'
                }`}
              >
                <option value="">Select a course...</option>
                {POPULAR_COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            )}
          </div>
          {activeErrors.course && (touched.course || backendErrors.course) && (
            <p className="text-xs text-rose-600 font-medium mt-1">{activeErrors.course}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-100">
        <Link
          to="/students"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEdit ? 'Saving Changes...' : 'Creating Student...'}</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'Update Student Record' : 'Save Student'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
