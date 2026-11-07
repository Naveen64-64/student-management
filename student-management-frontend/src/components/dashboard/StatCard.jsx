import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'indigo',
}) => {
  const schemes = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      glow: 'shadow-indigo-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      glow: 'shadow-emerald-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      glow: 'shadow-purple-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      glow: 'shadow-amber-100',
    },
  };

  const scheme = schemes[colorScheme] || schemes.indigo;

  return (
    <div className={`p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start justify-between`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium pt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className={`p-3.5 rounded-2xl ${scheme.bg} ${scheme.text} ${scheme.border} border`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatCard;
