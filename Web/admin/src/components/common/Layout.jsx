// Layout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
      
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="admin-main">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}