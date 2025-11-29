// Database utility functions
// Uses local storage as fallback, can be upgraded to Supabase/PostgreSQL

interface Design {
  id: string;
  userId?: string;
  productType: string;
  designData: any;
  previewImageUrl?: string;
  designFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  userId?: string;
  designId?: string;
  productType: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  status: string;
  printfulOrderId?: string;
  trackingNumber?: string;
  shippingAddress: any;
  createdAt: string;
  updatedAt: string;
}

interface ChefBooking {
  id: string;
  userId?: string;
  serviceType: string;
  eventDate?: string;
  numberOfGuests: number;
  dietaryPreferences: any;
  menuPreferences: any;
  location: any;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Local Storage Keys
const STORAGE_KEYS = {
  DESIGNS: 'bornfidis_designs',
  ORDERS: 'bornfidis_orders',
  BOOKINGS: 'bornfidis_bookings',
};

// Helper to get user ID (simple session-based for now)
function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  let userId = localStorage.getItem('bornfidis_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('bornfidis_user_id', userId);
  }
  return userId;
}

// Design Functions
export async function saveDesign(design: Omit<Design, 'id' | 'createdAt' | 'updatedAt'>): Promise<Design> {
  const designs = getDesignsInternal();
  const newDesign: Design = {
    ...design,
    id: `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: design.userId || getUserId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  designs.push(newDesign);
  localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designs));
  
  return newDesign;
}

export async function getDesign(id: string): Promise<Design | null> {
  const designs = getDesignsInternal();
  return designs.find(d => d.id === id) || null;
}

function getDesignsInternal(): Design[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.DESIGNS);
  return stored ? JSON.parse(stored) : [];
}

export async function getDesigns(userId?: string): Promise<Design[]> {
  const designs = getDesignsInternal();
  if (userId) {
    return designs.filter(d => d.userId === userId);
  }
  return designs;
}

export async function updateDesign(id: string, updates: Partial<Design>): Promise<Design | null> {
  const designs = getDesignsInternal();
  const index = designs.findIndex(d => d.id === id);
  
  if (index === -1) return null;
  
  designs[index] = {
    ...designs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designs));
  return designs[index];
}

export async function deleteDesign(id: string): Promise<boolean> {
  const designs = getDesignsInternal();
  const filtered = designs.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(filtered));
  return filtered.length < designs.length;
}

// Order Functions
export async function saveOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const orders = getOrdersInternal();
  const newOrder: Order = {
    ...order,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: order.userId || getUserId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  orders.push(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  
  return newOrder;
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = getOrdersInternal();
  return orders.find(o => o.id === id) || null;
}

function getOrdersInternal(): Order[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return stored ? JSON.parse(stored) : [];
}

export async function getOrders(userId?: string): Promise<Order[]> {
  const orders = getOrdersInternal();
  if (userId) {
    return orders.filter(o => o.userId === userId);
  }
  return orders;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  updates?: Partial<Order>
): Promise<Order | null> {
  const orders = getOrdersInternal();
  const index = orders.findIndex(o => o.id === orderId);
  
  if (index === -1) return null;
  
  orders[index] = {
    ...orders[index],
    status,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return orders[index];
}

export async function updateOrderByPrintfulId(
  printfulOrderId: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const orders = getOrdersInternal();
  const index = orders.findIndex(o => o.printfulOrderId === printfulOrderId);
  
  if (index === -1) return null;
  
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return orders[index];
}

// Chef Booking Functions
export async function saveChefBooking(
  booking: Omit<ChefBooking, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ChefBooking> {
  const bookings = getBookings();
  const newBooking: ChefBooking = {
    ...booking,
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: booking.userId || getUserId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  
  return newBooking;
}

export async function getChefBooking(id: string): Promise<ChefBooking | null> {
  const bookings = getBookings();
  return bookings.find(b => b.id === id) || null;
}

export async function getChefBookings(userId?: string): Promise<ChefBooking[]> {
  const bookings = getBookings();
  if (userId) {
    return bookings.filter(b => b.userId === userId);
  }
  return bookings;
}

function getBookings(): ChefBooking[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return stored ? JSON.parse(stored) : [];
}

// Export types
export type { Design, Order, ChefBooking };

