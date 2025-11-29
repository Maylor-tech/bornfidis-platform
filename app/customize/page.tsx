'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import DesignCanvas to avoid SSR issues with DOMParser
const DesignCanvas = dynamic(() => import('@/components/DesignCanvas'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bf-green"></div><p className="mt-4 text-gray-600">Loading canvas...</p></div></div>
});

import AIDesignAssistant from '@/components/AIDesignAssistant';
import ChefCustomizer from '@/components/ChefCustomizer';

type CustomizationMode = 'clothing' | 'chef';

export default function CustomizePage() {
  const [mode, setMode] = useState<CustomizationMode>('clothing');
  const [productType, setProductType] = useState('oversized-hoodie');
  const [baseColor, setBaseColor] = useState('#000000');
  const [designData, setDesignData] = useState<any>(null);

  const brandColors = [
    { name: 'Coral', value: '#CE673E' },
    { name: 'Sage', value: '#87A96B' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Natural', value: '#F5F5DC' },
  ];

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedColors, setGeneratedColors] = useState<string[]>([]);

  const handleDesignGenerated = (imageUrl: string, colorPalette: string[]) => {
    // Handle AI-generated design
    setGeneratedImage(imageUrl);
    setGeneratedColors(colorPalette);
    // Add the generated image to the canvas
    if (imageUrl) {
      // The image will be displayed and can be added to canvas
      alert('Design generated! Check the preview below. You can add it to your canvas.');
    }
  };

  const handleAddToCart = () => {
    if (!designData) {
      alert('Please create a design first');
      return;
    }

    // Import cart functions
    import('@/lib/cart').then(({ addToCart }) => {
      // Get preview image from canvas if available
      const canvas = document.querySelector('canvas');
      const previewImageUrl = canvas ? canvas.toDataURL('image/png') : undefined;

      // Calculate price (base price + customization fee)
      const basePrices: { [key: string]: number } = {
        'oversized-hoodie': 68,
        'classic-hoodie': 65,
        't-shirt': 35,
        'jacket': 85,
        'leggings': 55,
      };
      
      const basePrice = basePrices[productType] || 50;
      const customizationFee = 5; // Additional fee for custom designs
      const price = basePrice + customizationFee;

      addToCart({
        designId: undefined, // Will be set when saved
        productType,
        size: 'm-l', // Default size, user can change in cart
        color: baseColor,
        quantity: 1,
        price,
        designData,
        previewImageUrl,
      });

      alert('Added to cart!');
      // Optionally redirect to cart
      // window.location.href = '/cart';
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Customize Your Experience
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Use AI to generate custom designs or create your own with our design tools
          </p>
          
          {/* Mode Selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('clothing')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                mode === 'clothing'
                  ? 'bg-coral text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              👕 Custom Clothing
            </button>
            <button
              onClick={() => setMode('chef')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                mode === 'chef'
                  ? 'bg-coral text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              👨‍🍳 Chef Services
            </button>
          </div>
        </div>

        {mode === 'clothing' ? (
          <div className="space-y-6">
            {/* Product & Color Selection */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Select Product & Base Color</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Type
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  >
                    <option value="oversized-hoodie">Oversized Hoodie</option>
                    <option value="classic-hoodie">Classic Hoodie</option>
                    <option value="t-shirt">T-Shirt</option>
                    <option value="jacket">Jacket</option>
                    <option value="leggings">Leggings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Base Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {brandColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setBaseColor(color.value)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          baseColor === color.value
                            ? 'border-gray-800 scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Design Assistant */}
            <div className="bg-gradient-to-r from-coral to-coral-dark p-1 rounded-lg mb-6">
              <div className="bg-white rounded-lg p-1">
                <AIDesignAssistant
                  productType={productType}
                  onDesignGenerated={handleDesignGenerated}
                />
              </div>
            </div>

            {/* Generated Design Preview */}
            {generatedImage && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">✨ AI Generated Design</h2>
                <div className="mb-4">
                  <img 
                    src={generatedImage} 
                    alt="AI Generated Design" 
                    className="max-w-full h-auto rounded-lg border-2 border-gray-200"
                  />
                </div>
                {generatedColors.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold mb-2">Suggested Color Palette:</p>
                    <div className="flex gap-2 flex-wrap">
                      {generatedColors.map((color, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-600 mb-2">
                  The design has been automatically added to your canvas below. You can move, resize, or edit it there.
                </p>
              </div>
            )}

            {/* Design Canvas */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Design Canvas</h2>
              <DesignCanvas
                productType={productType}
                baseColor={baseColor}
                onDesignChange={setDesignData}
                aiGeneratedImage={generatedImage}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="px-6 py-3 bg-coral text-white rounded-lg font-semibold hover:bg-coral-dark"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ) : (
          <div>
            <ChefCustomizer serviceType="dinner" />
          </div>
        )}
      </div>
    </div>
  );
}

