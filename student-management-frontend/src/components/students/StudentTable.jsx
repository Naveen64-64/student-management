import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Mail, Phone } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return 'S';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getCourseColor = (course) => {
  const hash = course
    ? course.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  const colors = [
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-rose-50 text-rose-700 border-rose-200',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-teal-50 text-teal-700 border-teal-200',
  ];
  return colors[hash % colors.length];
};

export const StudentTable = ({ students = [], onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th scope="col" className="py-4 px-6">
              Student Info
            </th>
            <th scope="col" className="py-4 px-6">
              Course / Major
            </th>
            <th scope="col" className="py-4 px-6">
              Age
            </th>
            <th scope="col" className="py-4 px-6">
              Contact
            </th>
            <th scope="col" className="py-4 px-6 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {students.map((student) => {
            const initials = getInitials(student.name);
            const courseBadgeClass = getCourseColor(student.course);

            return (
              <tr
                key={student.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Student Info */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{student.email}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Course */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${courseBadgeClass}`}
                  >
                    {student.course}
                  </span>
                </td>

                {/* Age */}
                <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                  <span className="font-medium text-slate-900">{student.age}</span> yrs
                </td>

                {/* Contact (Phone) */}
                <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{student.phone}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/students/edit/${student.id}`}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit Student"
                      aria-label={`Edit ${student.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(student)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Student"
                      aria-label={`Delete ${student.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
