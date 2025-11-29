'use client';

import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

interface DesignCanvasProps {
  productType: string;
  baseColor: string;
  onDesignChange: (designData: any) => void;
  aiGeneratedImage?: string | null; // Add prop for AI-generated images
}

export default function DesignCanvas({ 
  productType, 
  baseColor, 
  onDesignChange,
  aiGeneratedImage
}: DesignCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState<'text' | 'image' | 'graphic' | null>(null);

  useEffect(() => {
    if (canvasRef.current && typeof window !== 'undefined') {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 1000,
        backgroundColor: baseColor,
      });
      setCanvas(fabricCanvas);

      // Load product template
      loadProductTemplate(productType, fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [productType, baseColor]);

  // Add AI-generated image to canvas when it's available
  useEffect(() => {
    if (aiGeneratedImage && canvas) {
      fabric.Image.fromURL(aiGeneratedImage, (imgObj: any) => {
        imgObj.set({
          left: 400,
          top: 500,
          scaleX: 0.8,
          scaleY: 0.8,
        });
        canvas.add(imgObj);
        canvas.renderAll();
        // Update layers after adding image
        const objects = canvas.getObjects();
        setLayers(objects);
        const designData = {
          objects: objects.map((obj: any) => obj.toJSON()),
          canvas: canvas.toJSON(),
        };
        onDesignChange(designData);
      });
    }
  }, [aiGeneratedImage, canvas, onDesignChange]);

  const loadProductTemplate = (type: string, canvas: any) => {
    // Load product mockup image (optional - will work without template)
    // Template images can be added later to /public/templates/
    try {
      const img = new Image();
      img.src = `/templates/${type}-template.png`;
      img.onerror = () => {
        // Template not found - that's okay, canvas will work without it
        console.log('Template not found, using blank canvas');
      };
      img.onload = () => {
        fabric.Image.fromURL(img.src, (imgObj: any) => {
          imgObj.scaleToWidth(canvas.width!);
          canvas.add(imgObj);
          canvas.renderAll();
        });
      };
    } catch (error) {
      // Continue without template
      console.log('Canvas ready without template');
    }
  };

  const addText = (text: string, options: any = {}) => {
    if (!canvas) return;
    
    const textObj = new fabric.Text(text, {
      left: options.x || 400,
      top: options.y || 500,
      fontSize: options.fontSize || 40,
      fill: options.color || '#000000',
      fontFamily: options.font || 'Arial',
      ...options
    });
    
    canvas.add(textObj);
    canvas.renderAll();
    updateLayers();
  };

  const addImage = (imageUrl: string, options: any = {}) => {
    if (!canvas) return;
    
    fabric.Image.fromURL(imageUrl, (imgObj: any) => {
      imgObj.set({
        left: options.x || 400,
        top: options.y || 500,
        scaleX: options.scale || 0.5,
        scaleY: options.scale || 0.5,
      });
      canvas.add(imgObj);
      canvas.renderAll();
      updateLayers();
    });
  };

  const updateLayers = () => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    setLayers(objects);
    
    // Export design data
    const designData = {
      objects: objects.map((obj: any) => obj.toJSON()),
      canvas: canvas.toJSON(),
    };
    onDesignChange(designData);
  };

  const saveDesign = async () => {
    if (!canvas) return;
    
    const designData = {
      objects: canvas.getObjects().map((obj: any) => obj.toJSON()),
      canvas: canvas.toJSON(),
    };
    
    // Convert canvas to data URL for preview
    const previewDataUrl = canvas.toDataURL('image/png');
    
    try {
      const response = await fetch('/api/designs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          designData,
          previewImageDataUrl: previewDataUrl,
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Design saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save design:', error);
      alert('Failed to save design');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      addImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="design-canvas-container flex flex-col lg:flex-row gap-4">
      <div className="canvas-wrapper flex-1">
        <canvas 
          ref={canvasRef} 
          className="border-2 border-gray-300 rounded-lg shadow-lg max-w-full"
        />
      </div>
      
      <div className="toolbar w-full lg:w-64 bg-white p-4 rounded-lg shadow">
        <div className="tool-section mb-4">
          <h3 className="font-semibold mb-2">Tools</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedTool('text')}
              className={`px-4 py-2 rounded ${selectedTool === 'text' ? 'bg-coral text-white' : 'bg-gray-100'}`}
            >
              Add Text
            </button>
            <button
              onClick={() => setSelectedTool('image')}
              className={`px-4 py-2 rounded ${selectedTool === 'image' ? 'bg-coral text-white' : 'bg-gray-100'}`}
            >
              Upload Image
            </button>
            <button
              onClick={() => setSelectedTool('graphic')}
              className={`px-4 py-2 rounded ${selectedTool === 'graphic' ? 'bg-coral text-white' : 'bg-gray-100'}`}
            >
              Graphics Library
            </button>
          </div>
        </div>

        {selectedTool === 'text' && (
          <div className="tool-section mb-4">
            <input
              type="text"
              placeholder="Enter text..."
              className="w-full px-3 py-2 border rounded mb-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addText((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        )}

        {selectedTool === 'image' && (
          <div className="tool-section mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full"
            />
          </div>
        )}

        <div className="layer-panel">
          <h3 className="font-semibold mb-2">Layers</h3>
          <div className="space-y-1 mb-4">
            {layers.map((layer, index) => (
              <div 
                key={index} 
                className="layer-item p-2 bg-gray-50 rounded text-sm"
              >
                {layer.type} - {layer.text || 'Graphic'}
              </div>
            ))}
          </div>
          
          <button
            onClick={saveDesign}
            className="w-full bg-coral text-white py-2 px-4 rounded-lg font-semibold hover:bg-coral-dark transition-colors"
          >
            Save Design
          </button>
        </div>
      </div>
    </div>
  );
}

