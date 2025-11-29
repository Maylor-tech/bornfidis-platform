import axios from 'axios';
import { config } from './config';

const PRINTFUL_API_URL = config.printful.apiUrl;
const PRINTFUL_API_KEY = config.printful.apiKey;

interface PrintfulRecipient {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  phone?: string;
  email?: string;
}

interface PrintfulFile {
  url: string;
  type: 'front' | 'back' | 'left' | 'right';
}

interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: PrintfulFile[];
  options?: {
    [key: string]: any;
  };
}

interface PrintfulOrder {
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  external_id?: string;
}

// Product variant mapping
const PRODUCT_VARIANTS: { [key: string]: { [key: string]: number } } = {
  'oversized-hoodie': {
    's-m': 4011,
    'm-l': 4012,
    'l-xl': 4013,
  },
  'classic-hoodie': {
    's': 71,
    'm': 72,
    'l': 73,
    'xl': 74,
    '2xl': 75,
  },
  't-shirt': {
    's': 5,
    'm': 6,
    'l': 7,
    'xl': 8,
    '2xl': 9,
  },
};

export function getVariantId(productType: string, size: string): number {
  const variants = PRODUCT_VARIANTS[productType];
  if (!variants) {
    throw new Error(`Unknown product type: ${productType}`);
  }
  
  const variantId = variants[size.toLowerCase()];
  if (!variantId) {
    throw new Error(`Unknown size ${size} for product ${productType}`);
  }
  
  return variantId;
}

export async function createPrintfulOrder(order: PrintfulOrder) {
  if (!PRINTFUL_API_KEY) {
    throw new Error(
      'Printful API key not configured. Please add PRINTFUL_API_KEY to your .env.local file.'
    );
  }

  try {
    const response = await axios.post(
      `${PRINTFUL_API_URL}/orders`,
      order,
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = (response.data as any).result;
    return {
      success: true,
      orderId: result.id,
      status: result.status,
      tracking: result.shipments?.[0]?.tracking_number,
      data: result,
    };
  } catch (error: any) {
    console.error('Printful API error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.result?.message || 
      'Failed to create Printful order'
    );
  }
}

export async function uploadDesignFile(fileUrl: string) {
  if (!PRINTFUL_API_KEY) {
    throw new Error('Printful API key not configured');
  }

  try {
    const response = await axios.post(
      `${PRINTFUL_API_URL}/files`,
      {
        type: 'default',
        url: fileUrl,
      },
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return (response.data as any).result;
  } catch (error: any) {
    console.error('File upload error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.result?.message || 
      'Failed to upload design file'
    );
  }
}

export async function getOrderStatus(orderId: string) {
  if (!PRINTFUL_API_KEY) {
    throw new Error('Printful API key not configured');
  }

  try {
    const response = await axios.get(
      `${PRINTFUL_API_URL}/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        },
      }
    );

    return (response.data as any).result;
  } catch (error: any) {
    console.error('Get order status error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.result?.message || 
      'Failed to get order status'
    );
  }
}

export async function generateMockup(
  variantId: number,
  files: PrintfulFile[],
  options?: any
) {
  if (!PRINTFUL_API_KEY) {
    throw new Error('Printful API key not configured');
  }

  try {
    const response = await axios.post(
      `${PRINTFUL_API_URL}/mockup-generator/create-task`,
      {
        variant_id: variantId,
        files,
        ...options,
      },
      {
        headers: {
          'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return (response.data as any).result;
  } catch (error: any) {
    console.error('Mockup generation error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.result?.message || 
      'Failed to generate mockup'
    );
  }
}

