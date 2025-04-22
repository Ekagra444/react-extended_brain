import React from 'react';
import ContentForm from '../../components/content/ContentForm';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';

const CreatePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
        <p className="text-gray-600">Add a new note to your Second Brain</p>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Note Details</h2>
        </CardHeader>
        <CardBody>
          <ContentForm mode="create" />
        </CardBody>
      </Card>
    </div>
  );
};

export default CreatePage;