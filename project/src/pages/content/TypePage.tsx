import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContentStore } from '../../store/contentStore';
import ContentGrid from '../../components/content/ContentGrid';

const TypePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { contents, isLoading, setFilters } = useContentStore();
  
  const titleMap: Record<string, string> = {
    youtube: 'YouTube Videos',
    twitter: 'Twitter Posts',
    blog: 'Blog Posts',
    task: 'Tasks',
    other: 'Other Notes'
  };
  
  const descriptionMap: Record<string, string> = {
    youtube: 'Your saved YouTube videos and notes',
    twitter: 'Your saved tweets and Twitter threads',
    blog: 'Your saved blog posts and articles',
    task: 'Your tasks and to-dos',
    other: 'Other miscellaneous notes'
  };
  
  useEffect(() => {
    if (type) {
      setFilters({ type });
    }
  }, [type, setFilters]);
  
  const title = titleMap[type || ''] || 'Notes';
  const description = descriptionMap[type || ''] || 'Your saved notes';
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <ContentGrid 
        contents={contents}
        isLoading={isLoading}
        emptyMessage={`No ${type} notes found. Click 'Add Note' to create one.`}
      />
    </div>
  );
};

export default TypePage;