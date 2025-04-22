import React from 'react';
import ContentCard from './ContentCard';
import { Content } from '../../types';
import Loader from '../ui/Loader';

interface ContentGridProps {
  contents: Content[];
  isLoading: boolean;
  emptyMessage?: string;
}

const ContentGrid: React.FC<ContentGridProps> = ({ 
  contents, 
  isLoading,
  emptyMessage = 'No notes found'
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contents.map((content) => (
        <ContentCard key={content._id} content={content} />
      ))}
    </div>
  );
};

export default ContentGrid;