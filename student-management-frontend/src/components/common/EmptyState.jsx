import React from 'react';
import { Users, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Users,
  title = 'No Students Found',
  description = 'Get started by creating a new student record in your system.',
  actionText = 'Add New Student',
  actionLink = '/students/new',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      <div className="mt-6">
        {actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            {actionText}
          </Link>
        ) : onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm transition"
          >
            {actionText}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EmptyState;
