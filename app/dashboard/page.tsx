'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

interface Booking {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      // Fetch orders and bookings
      const [ordersRes, bookingsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/bookings'),
      ]);

      const ordersData = await ordersRes.json();
      const bookingsData = await bookingsRes.json();

      setOrders(ordersData.orders || []);
      setBookings(bookingsData.bookings || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bf-green"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-headline text-bf-green mb-8">
          Welcome back, {session.user?.name || 'User'}!
        </h1>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-headline text-bf-green mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-bf-green">{session.user?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-bf-green">{session.user?.email}</p>
              </div>
              <Link
                href="/dashboard/profile"
                className="inline-block mt-4 text-bf-gold hover:underline font-semibold"
              >
                Edit Profile →
              </Link>
            </div>
          </div>

          {/* Orders Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-headline text-bf-green mb-4">Orders</h2>
            <div className="text-4xl font-bold text-bf-gold mb-2">{orders.length}</div>
            <p className="text-gray-600 mb-4">Total orders</p>
            <Link
              href="/dashboard/orders"
              className="text-bf-gold hover:underline font-semibold"
            >
              View All →
            </Link>
          </div>

          {/* Bookings Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-headline text-bf-green mb-4">Bookings</h2>
            <div className="text-4xl font-bold text-bf-gold mb-2">{bookings.length}</div>
            <p className="text-gray-600 mb-4">Upcoming bookings</p>
            <Link
              href="/dashboard/bookings"
              className="text-bf-gold hover:underline font-semibold"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-headline text-bf-green mb-6">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders yet. <Link href="/sportswear" className="text-bf-gold hover:underline">Start shopping</Link></p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-semibold text-bf-green">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-bf-gold">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-headline text-bf-green mb-6">Upcoming Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-600">No upcoming bookings. <Link href="/chef" className="text-bf-gold hover:underline">Book a service</Link></p>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-semibold text-bf-green capitalize">{booking.serviceType}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{booking.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




