import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Mail, Phone, Calendar } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return 'S';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const StudentCard = ({ student, onDelete }) => {
  const initials = getInitials(student.name);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {initials}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-base">{student.name}</h4>
              <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-md font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {student.course}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{student.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{student.age} years old</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        <Link
          to={`/students/edit/${student.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(student)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
