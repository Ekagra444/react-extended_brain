import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useContentStore } from '../../store/contentStore';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // let isSidebarOpen:boolean = true; //will not cause re-render
  const { fetchProfile } = useAuthStore();
  const { fetchContents, fetchTags } = useContentStore();
  
  const toggleSidebar = () => {
    setIsSidebarOpen((isSidebarOpen)=>!isSidebarOpen);
    // isSidebarOpen=!isSidebarOpen
  };
  
  useEffect(() => {
    fetchProfile();
    fetchContents();
    fetchTags();
  }, [fetchProfile, fetchContents, fetchTags]);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`
        fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0
        transition duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
       
      `}>
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;