import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import api from '../../services/api';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/dashboard/status');
        setSystemStatus(res.data);
      } catch (err) {
        console.warn('Could not fetch system status:', err.message);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        systemStatus={systemStatus}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Navbar */}
        <Navbar setMobileOpen={setMobileOpen} systemStatus={systemStatus} />

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
