import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Share, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useContentStore } from '../../store/contentStore';
import { contentService } from '../../services/contentService';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { toast } from 'react-hot-toast';

const ViewPage: React.FC = () => {
  const { id } = useParams<{ id : string }>();
  const navigate = useNavigate();
  const { currentContent, fetchContent, deleteContent, isLoading } = useContentStore();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  
  useEffect(() => {
    if (id) {
      //console.log('Fetching content with ID:', id);
      fetchContent(id);
    }
  }, [id, fetchContent]);
  console.log("Current content:", currentContent);

  
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      setIsDeleting(true);
      
      try {
        await deleteContent(id);
        toast.success('Note deleted');
        navigate('/');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete note');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleShare = async () => {
    if (!id) return;
    
    setIsSharing(true);
    
    try {
      const response = await contentService.shareContent({
        contentIds: [id],
        expiresIn: 24 // Expires in 24 hours
      });
      
      setShareLink(response.shareLink);
      toast.success('Share link created!');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to create share link');
    } finally {
      setIsSharing(false);
    }
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard!');
  };
  
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
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-600 hover:text-indigo-500"
        >
          Go back to home
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{currentContent.title}</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit size={16} />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Share size={16} />}
              onClick={handleShare}
              isLoading={isSharing}
            >
              Share
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 size={16} />}
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </CardHeader>
        
        <CardBody>
          {shareLink && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-sm text-indigo-700">Share link (valid for 24 hours)</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyShareLink}
                >
                  Copy Link
                </Button>
              </div>
              <div className="mt-2 truncate text-indigo-600 text-sm">
                {shareLink}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <Badge variant={currentContent.type as any} size="md" className="mr-2">
              {currentContent.type.charAt(0).toUpperCase() + currentContent.type.slice(1)}
            </Badge>
            
            <span className="text-sm text-gray-500">
              Created: {new Date(currentContent.createdAt).toLocaleDateString()}
            </span>
            
            {currentContent.url && (
              <div className="mt-2">
                <a
                  href={currentContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <ExternalLink size={14} className="mr-1" />
                  {currentContent.url}
                </a>
              </div>
            )}
          </div>
          
          <div className="prose max-w-none">
            <ReactMarkdown>{currentContent.content}</ReactMarkdown>
          </div>
        </CardBody>
        
        {currentContent.tags && currentContent.tags.length > 0 && (
          <CardFooter>
            <div className="flex flex-wrap gap-2">
              {currentContent.tags.map((tag, index) => (
                <Badge key={index} variant="default" size="md">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ViewPage;