import React, { useState, KeyboardEvent } from 'react';
import Badge from './Badge';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  label,
  placeholder = 'Add tags...',
  error,
}) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) {
        onAddTag(input.trim());
        setInput('');
      }
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className={`flex flex-wrap items-center border rounded-md p-2 ${error ? 'border-red-300' : 'border-gray-300'}`}>
        {tags.map((tag, index) => (
          <div key={index} className="mr-2 mb-2">
            <Badge
              variant="primary"
              size="md"
              onRemove={() => onRemoveTag(index)}
            >
              {tag}
            </Badge>
          </div>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="outline-none border-none flex-grow min-w-[120px] h-8 focus:ring-0"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
};

export default TagInput;