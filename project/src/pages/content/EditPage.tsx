import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentForm from '../../components/content/ContentForm';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import { useContentStore } from '../../store/contentStore';
import Loader from '../../components/ui/Loader';

const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentContent, fetchContent, isLoading } = useContentStore();
  
  useEffect(() => {
    if (id) {
      fetchContent(id);
    }
  }, [id, fetchContent]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (!currentContent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-700">Note not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Go back
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
        <p className="text-gray-600">Update your note details</p>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Note Details</h2>
        </CardHeader>
        <CardBody>
          <ContentForm mode="edit" initialData={currentContent} />
        </CardBody>
      </Card>
    </div>
  );
};

export default EditPage;