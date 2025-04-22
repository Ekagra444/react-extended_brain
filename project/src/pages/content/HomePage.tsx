import React, { useEffect } from 'react';
import { useContentStore } from '../../store/contentStore';
import ContentGrid from '../../components/content/ContentGrid';

const HomePage: React.FC = () => {
  const { contents, isLoading, fetchContents, setFilters } = useContentStore();
  
  useEffect(() => {
    setFilters({ type: 'all' });
  }, [setFilters]);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Notes</h1>
        <p className="text-gray-600">View and manage all your saved notes</p>
      </div>
      
      <ContentGrid 
        contents={contents}
        isLoading={isLoading}
        emptyMessage="No notes found. Click 'Add Note' to create your first note."
      />
    </div>
  );
};

export default HomePage;