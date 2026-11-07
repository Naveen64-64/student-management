import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus, GraduationCap } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Hamburger (mobile) + Brand logo */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                  Student<span className="text-indigo-600">Hub</span>
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                  Student Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right section: System Status & Quick Action */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>System Operational</span>
            </div>

            {/* Quick Add Button if not already on add page */}
            {location.pathname !== '/students/new' && (
              <Link
                to="/students/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Student</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
