'use client';
import { useState } from 'react';

interface Props {
  onSubmit: (description: string) => void;
  loading: boolean;
}

export default function DescriptionInput({ onSubmit, loading }: Props) {
  const [description, setDescription] = useState('');

  return (
    <div className="mb-8">
      <textarea
        className="w-full p-4 border rounded-lg min-h-[200px] mb-4 dark:bg-gray-800"
        placeholder="Describe your database schema (e.g., 'Create a blog system with users, posts, and comments...')"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        onClick={() => onSubmit(description)}
        disabled={loading || !description.trim()}
      >
        {loading ? 'Generating...' : 'Generate Schema'}
      </button>
    </div>
  );
}
