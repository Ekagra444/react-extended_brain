import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, Twitter, CheckSquare, BookOpen, MoreHorizontal, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Card, { CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import { Content } from '../../types';

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/view/${content._id}`);
  };
  
  const getTypeIcon = () => {
    switch (content.type) {
      case 'youtube':
        return <Youtube size={16} className="text-red-600" />;
      case 'twitter':
        return <Twitter size={16} className="text-blue-500" />;
      case 'task':
        return <CheckSquare size={16} className="text-green-600" />;
      case 'blog':
        return <BookOpen size={16} className="text-purple-600" />;
      default:
        return <MoreHorizontal size={16} className="text-gray-600" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const truncateContent = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <Card hoverEffect onClick={handleClick} className="h-full">
      <CardBody className="flex flex-col h-full">
        <div className="flex items-center mb-2">
          <span className="mr-2">{getTypeIcon()}</span>
          <Badge variant={content.type as any} size="sm">
            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
          </Badge>
          {content.url && (
            <a 
              href={content.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-gray-500 hover:text-indigo-600"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">{content.title}</h3>
        <p className="text-sm text-gray-500 mb-4 flex-grow">
          {truncateContent(content.content)}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1 mb-2">
            {content.tags.map((tag, index) => (
              <Badge key={index} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(content.createdAt)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ContentCard;