'use client';
import { useState } from 'react';
import SchemaVisualizer from '@/components/SchemaVisualizer';
import DescriptionInput from '@/components/DescriptionInput';
import { DBSchema } from '@/types/schema';

export default function Home() {
  const [schema, setSchema] = useState<DBSchema | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateSchema = async (description: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      setSchema(data);
    } catch (error) {
      console.error('Error generating schema:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">DB Mind - Database Schema Generator</h1>
      <DescriptionInput onSubmit={handleGenerateSchema} loading={loading} />
      {schema && <SchemaVisualizer schema={schema} />}
    </main>
  );
}
