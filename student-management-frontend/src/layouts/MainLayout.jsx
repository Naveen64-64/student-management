import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar (Desktop sticky / Mobile drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content wrapper shifted by sidebar width on large screens */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              Student Management System
            </span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                Developed by{' '}
                <strong className="text-indigo-600 font-semibold">
                  Softspark Team
                </strong>
              </span>
              <span>&bull;</span>
              <span>
                Done Date:{' '}
                <strong className="text-slate-700 font-medium">
                  November 07, 2026
                </strong>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
