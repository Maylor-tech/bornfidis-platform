'use client';

import { useState } from 'react';

interface AIDesignAssistantProps {
  productType: string;
  onDesignGenerated: (imageUrl: string, colorPalette: string[]) => void;
}

export default function AIDesignAssistant({ 
  productType, 
  onDesignGenerated 
}: AIDesignAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDesign = async () => {
    if (!prompt.trim()) {
      setError('Please enter a design description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          productType,
          style,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate design');
      }

      onDesignGenerated(data.imageUrl, data.colorPalette);
      setPrompt(''); // Clear prompt after success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate design');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        🎨 AI Design Assistant
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your design
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Mountain landscape with coral sunset, minimalist style"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
          >
            <option value="modern">Modern</option>
            <option value="minimalist">Minimalist</option>
            <option value="vintage">Vintage</option>
            <option value="bold">Bold & Colorful</option>
            <option value="nature">Nature-Inspired</option>
            <option value="geometric">Geometric</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={generateDesign}
          disabled={loading}
          className="w-full bg-coral text-white py-3 px-6 rounded-lg font-semibold hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : '✨ Generate Design'}
        </button>

        <div className="text-sm text-gray-600">
          <p className="font-semibold mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Be specific about colors and themes</li>
            <li>Mention the mood or feeling you want</li>
            <li>Reference Bornfidis brand values: Adapt, Explore, Empower</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

