import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Content } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import TagInput from '../ui/TagInput';
import { useContentStore } from '../../store/contentStore';

interface ContentFormProps {
  initialData?: Partial<Content>;
  mode: 'create' | 'edit';
}

const ContentForm: React.FC<ContentFormProps> = ({ initialData = {}, mode }) => {
  const navigate = useNavigate();
  const { createContent, updateContent } = useContentStore();
  
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    url: initialData.url || '',
    type: initialData.type || 'other',
    tags: initialData.tags || [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const contentTypeOptions = [
    { value: 'youtube', label: 'YouTube Video' },
    { value: 'twitter', label: 'Twitter Post' },
    { value: 'blog', label: 'Blog Post' },
    { value: 'task', label: 'Task' },
    { value: 'other', label: 'Other' },
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as any }));
  };
  
  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };
  
  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (formData.url && formData.type === 'youtube') {
      // Simple YouTube URL validation
      if (!formData.url.includes('youtube.com') && !formData.url.includes('youtu.be')) {
        newErrors.url = 'Please enter a valid YouTube URL';
      }
    }
    
    if (formData.url && formData.type === 'twitter') {
      // Simple Twitter URL validation
      if (!formData.url.includes('twitter.com') && !formData.url.includes('x.com')) {
        newErrors.url = 'Please enter a valid Twitter URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        await createContent({
          title: formData.title,
          content: formData.content,
          url: formData.url,
          type: formData.type as any,
          tags: formData.tags,
        });
        navigate('/');
      } else if (mode === 'edit' && initialData._id) {
        await updateContent(initialData._id, {
          title: formData.title,
          content: formData.content,
          url: formData.url,
          type: formData.type as any,
          tags: formData.tags,
        });
        navigate(`/view/${initialData._id}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}
      
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter a title"
        error={errors.title}
        required
      />
      
      <TextArea
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Enter content..."
        error={errors.content}
        rows={6}
        required
      />
      
      <Select
        label="Content Type"
        name="type"
        value={formData.type}
        onChange={handleTypeChange}
        options={contentTypeOptions}
        error={errors.type}
      />
      
      <Input
        label="URL (optional)"
        name="url"
        value={formData.url}
        onChange={handleChange}
        placeholder={`Enter ${formData.type} URL`}
        error={errors.url}
      />
      
      <TagInput
        label="Tags"
        tags={formData.tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        placeholder="Add tags..."
        error={errors.tags}
      />
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {mode === 'create' ? 'Create Note' : 'Update Note'}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;