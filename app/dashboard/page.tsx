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
  const [isPremium, setIsPremium] = useState(false);
  const [premiumData, setPremiumData] = useState<{
    subscriptionId: string | null;
    activatedAt: string | null;
  } | null>(null);
  const [stats, setStats] = useState<{
    plansThisMonth: number;
    totalPlans: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      // Fetch orders, bookings, premium status, and stats
      const [ordersRes, bookingsRes, premiumRes, statsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/bookings'),
        fetch('/api/mealplanner/premium-status'),
        fetch('/api/dashboard/stats'),
      ]);

      const ordersData = await ordersRes.json();
      const bookingsData = await bookingsRes.json();
      const premiumData = await premiumRes.json();
      const statsData = await statsRes.json();

      setOrders(ordersData.orders || []);
      setBookings(bookingsData.bookings || []);
      setIsPremium(premiumData.isPremium || false);
      setPremiumData({
        subscriptionId: premiumData.subscriptionId || null,
        activatedAt: premiumData.activatedAt || null,
      });
      setStats({
        plansThisMonth: statsData.plansThisMonth || 0,
        totalPlans: statsData.totalPlans || 0,
      });
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

        {/* Premium Subscription Card */}
        {isPremium ? (
          <div className="bg-gradient-to-br from-bornfidis-green to-bornfidis-green/90 text-white rounded-lg shadow-lg p-6 mb-8 border-4 border-bornfidis-gold">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-headline mb-0">Premium Meal Planner</h2>
              <span className="bg-bornfidis-gold text-bornfidis-green px-3 py-1 rounded-full text-sm font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-white/90 mb-4">
              You have full access to all premium meal planning features.
            </p>
            
            {/* Subscription Details */}
            {premiumData?.activatedAt && (
              <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white/70 mb-1">Member Since</p>
                    <p className="font-semibold">
                      {new Date(premiumData.activatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 mb-1">Subscription Status</p>
                    <p className="font-semibold">Active</p>
                  </div>
                  {stats && (
                    <div>
                      <p className="text-white/70 mb-1">Plans This Month</p>
                      <p className="font-semibold">{stats.plansThisMonth}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Usage Stats */}
            {stats && stats.totalPlans > 0 && (
              <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <h3 className="text-white font-semibold mb-3">Your Activity</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/70 mb-1">Total Meal Plans</p>
                    <p className="text-2xl font-bold text-bornfidis-gold">{stats.totalPlans}</p>
                  </div>
                  <div>
                    <p className="text-white/70 mb-1">This Month</p>
                    <p className="text-2xl font-bold text-bornfidis-gold">{stats.plansThisMonth}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/mealplanner"
                className="bg-white text-bornfidis-green rounded-lg px-6 py-2 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition text-center"
              >
                Start Meal Planning
              </Link>
              <Link
                href="/dashboard/mealplans"
                className="border-2 border-white text-white rounded-lg px-6 py-2 font-semibold hover:bg-white hover:text-bornfidis-green transition text-center"
              >
                View Meal Plans
              </Link>
              <button
                onClick={async () => {
                  setPortalLoading(true)
                  try {
                    const response = await fetch('/api/stripe/create-portal-session', {
                      method: 'POST',
                    })
                    const data = await response.json()
                    if (data.url) {
                      window.location.href = data.url
                    } else {
                      alert('Failed to open billing portal')
                    }
                  } catch (err) {
                    console.error('Error opening portal:', err)
                    alert('Failed to open billing portal')
                  } finally {
                    setPortalLoading(false)
                  }
                }}
                disabled={portalLoading}
                className="border-2 border-white/50 text-white rounded-lg px-6 py-2 font-semibold hover:bg-white/20 transition text-center disabled:opacity-50"
              >
                {portalLoading ? 'Loading...' : 'Manage Billing'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-bornfidis-gold/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-headline text-bf-green mb-0">Meal Planner</h2>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                FREE
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Upgrade to Premium for full 7-day meal plans, PDF exports, and weekly AI meal drops.
            </p>
            <Link
              href="/mealplanner/upgrade"
              className="inline-block bg-bornfidis-green text-white rounded-lg px-6 py-2 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition"
            >
              Upgrade to Premium →
            </Link>
          </div>
        )}

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




