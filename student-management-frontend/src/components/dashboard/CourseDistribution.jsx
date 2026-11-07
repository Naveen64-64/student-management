import React from 'react';
import { BookOpen } from 'lucide-react';

export const CourseDistribution = ({ students = [] }) => {
  // Aggregate students by course
  const courseCounts = students.reduce((acc, student) => {
    const course = student.course || 'Unassigned';
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {});

  const total = students.length;
  const sortedCourses = Object.entries(courseCounts).sort((a, b) => b[1] - a[1]);

  if (total === 0) {
    return null;
  }

  const colors = [
    'bg-indigo-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-sky-500',
    'bg-rose-500',
    'bg-teal-500',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-800 text-base">Course Enrollment</h3>
        </div>
        <span className="text-xs font-medium text-slate-500">
          {sortedCourses.length} {sortedCourses.length === 1 ? 'Program' : 'Programs'}
        </span>
      </div>

      <div className="space-y-4">
        {sortedCourses.slice(0, 5).map(([courseName, count], idx) => {
          const percentage = Math.round((count / total) * 100);
          const color = colors[idx % colors.length];

          return (
            <div key={courseName} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 truncate max-w-[200px]">
                  {courseName}
                </span>
                <span className="font-semibold text-slate-900">
                  {count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseDistribution;
