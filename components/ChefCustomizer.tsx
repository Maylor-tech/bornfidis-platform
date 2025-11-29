'use client';

import { useState } from 'react';

interface ChefCustomizerProps {
  serviceType: 'dinner' | 'mealprep' | 'class' | 'event';
}

interface Preferences {
  dietary: string[];
  cuisine: string;
  spiceLevel: string;
  portionSize: string;
  allergies: string[];
  favoriteIngredients: string[];
  dislikedIngredients: string[];
  numberOfGuests?: number;
  eventDate?: string;
}

interface MenuCourse {
  name: string;
  description: string;
  ingredients: string[];
  dietary: string[];
  prepTime?: string;
}

interface GeneratedMenu {
  courses: MenuCourse[];
  estimatedCost: number;
  prepTime: string;
  shoppingList: string[];
}

export default function ChefCustomizer({ serviceType }: ChefCustomizerProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    dietary: [],
    cuisine: '',
    spiceLevel: 'medium',
    portionSize: 'standard',
    allergies: [],
    favoriteIngredients: [],
    dislikedIngredients: [],
  });

  const [generatedMenu, setGeneratedMenu] = useState<GeneratedMenu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dietaryOptions = [
    'Vegan',
    'Vegetarian',
    'Pescatarian',
    'Gluten-Free',
    'Keto',
    'Paleo',
    'Mediterranean',
    'Dairy-Free',
  ];

  const cuisineOptions = [
    'Caribbean',
    'Mediterranean',
    'Farm-to-Table',
    'Fusion',
    'Comfort Food',
    'Healthy/Wellness',
    'Asian Fusion',
  ];

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const generateAIMenu = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chef/generate-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          preferences,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate menu');
      }

      setGeneratedMenu(data.menu);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chef-customizer max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Customize Your {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Experience
      </h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Dietary Preferences */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Dietary Preferences
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dietaryOptions.map(option => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={preferences.dietary.includes(option)}
                  onChange={() => {
                    setPreferences({
                      ...preferences,
                      dietary: toggleArrayItem(preferences.dietary, option),
                    });
                  }}
                  className="w-4 h-4 text-coral focus:ring-coral border-gray-300 rounded"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cuisine Style */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cuisine Style
          </label>
          <select
            value={preferences.cuisine}
            onChange={(e) => setPreferences({ ...preferences, cuisine: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
          >
            <option value="">Select cuisine style...</option>
            {cuisineOptions.map(option => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Spice Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Spice Level
          </label>
          <div className="flex gap-4">
            {['mild', 'medium', 'spicy', 'very-spicy'].map(level => (
              <label key={level} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="spiceLevel"
                  value={level}
                  checked={preferences.spiceLevel === level}
                  onChange={(e) => setPreferences({ ...preferences, spiceLevel: e.target.value })}
                  className="w-4 h-4 text-coral focus:ring-coral"
                />
                <span className="text-sm capitalize">{level.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Allergies or Dietary Restrictions
          </label>
          <textarea
            placeholder="List any allergies or dietary restrictions (e.g., nuts, shellfish, soy)..."
            value={preferences.allergies.join(', ')}
            onChange={(e) => {
              const allergies = e.target.value.split(',').map(a => a.trim()).filter(a => a);
              setPreferences({ ...preferences, allergies });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
            rows={2}
          />
        </div>

        {/* Favorite Ingredients */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Favorite Ingredients
          </label>
          <input
            type="text"
            placeholder="e.g., fresh herbs, local vegetables, seafood..."
            value={preferences.favoriteIngredients.join(', ')}
            onChange={(e) => {
              const ingredients = e.target.value.split(',').map(i => i.trim()).filter(i => i);
              setPreferences({ ...preferences, favoriteIngredients: ingredients });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateAIMenu}
          disabled={loading}
          className="w-full bg-coral text-white py-3 px-6 rounded-lg font-semibold hover:bg-coral-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '✨ Generating Your Custom Menu...' : '✨ Generate AI Menu'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Generated Menu */}
        {generatedMenu && (
          <div className="generated-menu mt-6 border-t pt-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Your Custom Menu
            </h3>
            
            <div className="space-y-4">
              {generatedMenu.courses.map((course, index) => (
                <div key={index} className="menu-course bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2">
                    {course.name}
                  </h4>
                  <p className="text-gray-600 mb-2">{course.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {course.dietary.map(diet => (
                      <span
                        key={diet}
                        className="px-2 py-1 bg-coral/10 text-coral text-xs rounded"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    <strong>Ingredients:</strong> {course.ingredients.join(', ')}
                  </p>
                  {course.prepTime && (
                    <p className="text-sm text-gray-500 mt-1">
                      Prep time: {course.prepTime}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-coral/5 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Estimated Cost:</strong> ${generatedMenu.estimatedCost.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Total Prep Time:</strong> {generatedMenu.prepTime}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

