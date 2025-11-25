import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, QrCode, Menu, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { subscriptionAPI } from '@/services/api';
import toast from 'react-hot-toast';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, restaurant, logout } = useAuthStore();
  const navigate = useNavigate();

  // Get subscription data for reminder badge
  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: subscriptionAPI.getSubscription,
    enabled: user?.role === 'restaurant'
  });

  const activeSubscription = subscriptionData?.data?.activeSubscription;
  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = activeSubscription ? getDaysRemaining(activeSubscription.endDate) : 0;
  const showReminder = user?.role === 'restaurant' && activeSubscription && daysRemaining <= 30;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/dashboard" className="flex items-center space-x-2">
            <QrCode className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <span className="text-lg md:text-xl font-bold text-gray-900 hidden sm:block">QRMenu Cloud</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {restaurant && (
            <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
              {restaurant.name}
            </span>
          )}
          
          {/* Subscription Reminder Badge */}
          {showReminder && (
            <Link to="/dashboard/subscription" className="relative">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 ${
                daysRemaining <= 7 ? 'bg-red-100 text-red-800 border border-red-300' :
                'bg-orange-100 text-orange-800 border border-orange-300'
              }`}>
                <AlertTriangle className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {daysRemaining <= 7 ? 'Expires Soon!' : `${daysRemaining}d left`}
                </span>
                <span className="sm:hidden">{daysRemaining}d</span>
              </div>
            </Link>
          )}
          
          <div className="flex items-center space-x-1 md:space-x-2">
            <span className="text-xs md:text-sm text-gray-700 hidden sm:block">{user?.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;