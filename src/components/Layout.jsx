import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Main Application Layout
 * Provides responsive sidebar shell and top navbar with sticky header.
 */
export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
