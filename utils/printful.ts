import axios from 'axios';

const PRINTFUL_API_URL = 'https://api.printful.com';

export interface PrintfulProduct {
  id: number;
  name: string;
  type: string;
  description: string;
  is_discontinued: boolean;
  images: string[];
  variants: PrintfulVariant[];
}

export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  price: string;
  in_stock: boolean;
  image: string;
}

export async function fetchPrintfulProducts(): Promise<PrintfulProduct[]> {
  try {
    const response = await axios.get(`${PRINTFUL_API_URL}/store/products`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });
    return (response.data as any).result || [];
  } catch (error) {
    console.error('Error fetching Printful products:', error);
    return [];
  }
}

export async function createPrintfulOrder(orderData: {
  recipient: {
    name: string;
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
  };
  items: Array<{
    variant_id: number;
    quantity: number;
  }>;
}) {
  try {
    const response = await axios.post(
      `${PRINTFUL_API_URL}/orders`,
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating Printful order:', error);
    throw error;
  }
}




