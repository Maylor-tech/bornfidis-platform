'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getOrder } from '@/lib/database';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-4">We couldn't find an order with that ID.</p>
          <a
            href="/shop"
            className="inline-block bg-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-coral-dark"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      sent_to_production: 'bg-purple-100 text-purple-800',
      in_production: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-200 text-green-900',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Payment Pending',
      processing: 'Processing',
      sent_to_production: 'Sent to Production',
      in_production: 'In Production',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      failed: 'Failed',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Tracking</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Order #{order.id.slice(-8)}</h2>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Product</p>
                <p className="font-semibold capitalize">{order.productType.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-600">Size</p>
                <p className="font-semibold">{order.size.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-600">Color</p>
                <p className="font-semibold capitalize">{order.color}</p>
              </div>
              <div>
                <p className="text-gray-600">Quantity</p>
                <p className="font-semibold">{order.quantity}</p>
              </div>
              <div>
                <p className="text-gray-600">Total</p>
                <p className="font-semibold text-coral">${order.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Tracking</h3>
              <p className="text-sm text-gray-600 mb-2">Tracking Number:</p>
              <p className="font-mono text-lg">{order.trackingNumber}</p>
              <a
                href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-coral hover:underline"
              >
                Track Package →
              </a>
            </div>
          )}

          {order.shippingAddress && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.name}<br />
                {order.shippingAddress.address1}<br />
                {order.shippingAddress.address2 && (
                  <>
                    {order.shippingAddress.address2}<br />
                  </>
                )}
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <a
            href="/shop"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}

