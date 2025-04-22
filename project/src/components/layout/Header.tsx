import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { useContentStore } from '../../store/contentStore';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { setFilters } = useContentStore();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        {/* <button
          className=" p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 mr-2"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button> */}
      </div>
      
      <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            className="block w-full bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:bg-white focus:border-indigo-500"
            
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>
      
      <div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => navigate('/create')}
        >
          Add Note
        </Button>
      </div>
    </header>
  );
};

export default Header;