import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Shield, Building, Users, CreditCard, Settings, Clock, Gift } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import toast from 'react-hot-toast';

const RestaurantRow = ({ restaurant }) => {
  const queryClient = useQueryClient();
  const [extending, setExtending] = useState(false);
  const [granting, setGranting] = useState(false);

  const { subscriptionInfo } = restaurant;
  const hasNoSubscription = subscriptionInfo.status === 'none';
  const isExpired = subscriptionInfo.status === 'expired';

  const extendMutation = useMutation({
    mutationFn: () => api.post(`/admin/restaurants/${restaurant.id}/extend-subscription`, { days: 3 }),
    onSuccess: () => {
      toast.success('Subscription extended by 3 days');
      queryClient.invalidateQueries(['admin-restaurants']);
      setExtending(false);
    },
    onError: () => {
      toast.error('Failed to extend subscription');
      setExtending(false);
    }
  });

  const grantFreeMutation = useMutation({
    mutationFn: () => api.post(`/admin/restaurants/${restaurant.id}/grant-free-month`),
    onSuccess: () => {
      toast.success('1 month free subscription granted');
      queryClient.invalidateQueries(['admin-restaurants']);
      setGranting(false);
    },
    onError: () => {
      toast.error('Failed to grant free subscription');
      setGranting(false);
    }
  });

  const getStatusBadge = () => {
    if (subscriptionInfo.status === 'active') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>;
    }
    if (subscriptionInfo.status === 'expired') {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Expired</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">No Subscription</span>;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-medium">{restaurant.name}</td>
      <td className="p-3">{restaurant.user?.name}</td>
      <td className="p-3 text-sm">{subscriptionInfo.planName}</td>
      <td className="p-3">{getStatusBadge()}</td>
      <td className="p-3 text-sm">{formatDate(subscriptionInfo.expiryDate)}</td>
      <td className="p-3">
        {subscriptionInfo.status === 'active' ? (
          <span className="font-semibold text-blue-600">{subscriptionInfo.remainingDays} days</span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="p-3">
        <div className="flex gap-2">
          {hasNoSubscription ? (
            <Button
              size="sm"
              onClick={() => {
                setGranting(true);
                grantFreeMutation.mutate();
              }}
              disabled={granting}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Gift className="w-4 h-4 mr-1" />
              {granting ? 'Granting...' : '1 Month Free'}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setExtending(true);
                extendMutation.mutate();
              }}
              disabled={extending}
            >
              <Clock className="w-4 h-4 mr-1" />
              {extending ? 'Extending...' : 'Extend 3 Days'}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};


const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats'),
  });

  const { data: restaurants } = useQuery({
    queryKey: ['admin-restaurants'],
    queryFn: () => api.get('/admin/restaurants'),
  });

  const statsData = stats?.data || {};
  const restaurantList = restaurants?.data?.restaurants || [];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          Platform Management & Analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Total Restaurants</p>
                <p className="text-3xl font-bold text-blue-900">{statsData.totalRestaurants || 0}</p>
              </div>
              <Building className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-green-900">{statsData.totalUsers || 0}</p>
              </div>
              <Users className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600 mb-1">Active Subscriptions</p>
                <p className="text-3xl font-bold text-purple-900">{statsData.activeSubscriptions || 0}</p>
              </div>
              <CreditCard className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            Admin Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/dashboard/admin/subscription-settings')}
              className="h-16 text-left justify-start"
              variant="outline"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Subscription Settings</div>
                  <div className="text-xs opacity-75">Manage plans and pricing</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restaurants List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            All Restaurants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Restaurant</th>
                  <th className="text-left p-3">Owner</th>
                  <th className="text-left p-3">Plan</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Expiry Date</th>
                  <th className="text-left p-3">Remaining Days</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurantList.map((restaurant) => (
                  <RestaurantRow key={restaurant.id} restaurant={restaurant} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;