// File storage utility
// Supports Cloudinary, AWS S3, or local file storage

import { config } from './config';

interface UploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: any;
}

interface UploadResult {
  url: string;
  publicId?: string;
  secureUrl?: string;
}

// Cloudinary upload
async function uploadToCloudinary(
  file: File | Blob | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const cloudinaryUrl = config.storage.cloudinary.url;
  if (!cloudinaryUrl) {
    throw new Error(
      'Cloudinary URL not configured. Please add CLOUDINARY_URL to your .env.local file.'
    );
  }

  // Parse Cloudinary URL: cloudinary://api_key:api_secret@cloud_name
  const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (!urlMatch) {
    throw new Error('Invalid Cloudinary URL format');
  }

  const [, apiKey, apiSecret, cloudName] = urlMatch;
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  
  // If file is a string (URL), fetch it first
  if (typeof file === 'string') {
    const response = await fetch(file);
    file = await response.blob();
  }
  
  formData.append('file', file);
  formData.append('upload_preset', config.storage.cloudinary.uploadPreset);
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
    secureUrl: data.secure_url,
  };
}

// AWS S3 upload
async function uploadToS3(
  file: File | Blob | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // This would require AWS SDK
  // For now, return a placeholder
  throw new Error('S3 upload not yet implemented. Use Cloudinary or local storage.');
}

// Local storage (for development/testing)
async function uploadToLocal(
  file: File | Blob | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // Convert to base64 and store in localStorage (not recommended for production)
  let blob: Blob;
  
  if (typeof file === 'string') {
    const response = await fetch(file);
    blob = await response.blob();
  } else {
    blob = file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const dataUrl = base64;
      
      // Store in localStorage with a key
      const key = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(`bornfidis_file_${key}`, dataUrl);
      
      resolve({
        url: dataUrl, // Data URL for local storage
        publicId: key,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Main upload function
export async function uploadFile(
  file: File | Blob | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // Determine which storage to use based on config
  const provider = config.storage.provider();
  
  if (provider === 'cloudinary') {
    return uploadToCloudinary(file, options);
  } else if (provider === 's3') {
    return uploadToS3(file, options);
  } else {
    // Fallback to local storage (development only)
    if (config.env.isProduction) {
      console.warn('⚠️  Using local storage in production is not recommended. Configure Cloudinary or S3.');
    }
    return uploadToLocal(file, options);
  }
}

// Convert canvas to file
export async function canvasToFile(
  canvas: HTMLCanvasElement,
  filename: string = 'design.png',
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to blob'));
          return;
        }
        const file = new File([blob], filename, { type: 'image/png' });
        resolve(file);
      },
      'image/png',
      quality
    );
  });
}

// Convert data URL to file
export function dataUrlToFile(dataUrl: string, filename: string = 'design.png'): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

// Delete file (for Cloudinary)
export async function deleteFile(publicId: string): Promise<boolean> {
  if (config.storage.cloudinary.enabled()) {
    const cloudinaryUrl = config.storage.cloudinary.url;
    const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (!urlMatch) return false;
    
    const [, apiKey, apiSecret, cloudName] = urlMatch;
    const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', Math.floor(Date.now() / 1000).toString());
    
    // Generate signature (simplified - in production, use proper signing)
    const signature = `public_id=${publicId}&timestamp=${formData.get('timestamp')}${apiSecret}`;
    formData.append('signature', signature);
    
    const response = await fetch(deleteUrl, {
      method: 'POST',
      body: formData,
    });
    
    return response.ok;
  }
  
  // For local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`bornfidis_file_${publicId}`);
  }
  return true;
}

