'use client';

import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItem, getCartTotal, clearCart, CartItem } from '@/lib/cart';
import Link from 'next/link';

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cartItems = getCart();
    setCart(cartItems);
    setTotal(getCartTotal());
  };

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId);
    loadCart();
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemove(itemId);
      return;
    }
    updateCartItem(itemId, { quantity });
    loadCart();
  };

  const handleCheckout = async () => {
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <Link
          href="/customize"
          className="inline-block bg-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-coral-dark"
        >
          Start Designing
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
      
      <div className="cart-items space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="cart-item bg-white p-4 rounded-lg shadow flex gap-4"
          >
            {item.previewImageUrl && (
              <img
                src={item.previewImageUrl}
                alt={item.productType}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 capitalize">
                {item.productType.replace('-', ' ')}
              </h3>
              <p className="text-sm text-gray-600">
                Size: {item.size.toUpperCase()} | Color: {item.color}
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="quantity-selector flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <div className="price text-lg font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-coral">${total.toFixed(2)}</span>
        </div>
        
        <button
          onClick={handleCheckout}
          className="w-full bg-coral text-white py-3 px-6 rounded-lg font-semibold hover:bg-coral-dark transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

