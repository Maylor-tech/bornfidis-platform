// Shopping cart management
// Uses localStorage for client-side cart

export interface CartItem {
  id: string;
  designId?: string;
  productType: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  designData?: any;
  previewImageUrl?: string;
}

const CART_KEY = 'bornfidis_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToCart(item: Omit<CartItem, 'id'>): CartItem {
  const cart = getCart();
  const newItem: CartItem = {
    ...item,
    id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  cart.push(newItem);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return newItem;
}

export function removeFromCart(itemId: string): boolean {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== itemId);
  localStorage.setItem(CART_KEY, JSON.stringify(filtered));
  return filtered.length < cart.length;
}

export function updateCartItem(itemId: string, updates: Partial<CartItem>): CartItem | null {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === itemId);
  
  if (index === -1) return null;
  
  cart[index] = { ...cart[index], ...updates };
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart[index];
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

