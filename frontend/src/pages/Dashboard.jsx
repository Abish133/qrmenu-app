import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QrCode, Menu, Users, CreditCard, Download, Sparkles, TrendingUp, Eye, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { menuAPI, subscriptionAPI } from '@/services/api';
import useAuthStore from '@/store/authStore';
import { generateQRCode, downloadQRCode } from '@/services/qrService';
import AdminDashboard from './AdminDashboard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, restaurant } = useAuthStore();
  
  // Show admin dashboard for admin users
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  
  const [qrGenerated, setQrGenerated] = useState(false);
  
  const menuUrl = `${window.location.origin}/r/${restaurant?.slug || 'demo-restaurant'}`;
  
  const handleGenerateQR = () => {
    setQrGenerated(true);
    toast.success('QR Code generated!');
  };
  
  const handleDownloadQR = async () => {
    try {
      await downloadQRCode(menuUrl, `${restaurant?.name || 'restaurant'}-qr-code`);
      toast.success('QR Code downloaded!');
    } catch (error) {
      toast.error('Failed to download QR Code');
    }
  };

  const { data: menuData } = useQuery({
    queryKey: ['menu'],
    queryFn: menuAPI.getMenu,
  });

  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: subscriptionAPI.getSubscription,
  });

  const totalCategories = menuData?.data?.restaurant?.categories?.length || 0;
  const totalItems = menuData?.data?.restaurant?.categories?.reduce(
    (acc, category) => acc + (category.menuItems?.length || 0), 0
  ) || 0;

  const activeSubscription = subscriptionData?.data?.activeSubscription;
  const daysLeft = activeSubscription 
    ? Math.ceil((new Date(activeSubscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Welcome back! Here's your restaurant overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Categories</p>
                <p className="text-3xl font-bold text-blue-900">{totalCategories}</p>
                <p className="text-xs text-blue-500 mt-1">Menu sections</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-1">Menu Items</p>
                <p className="text-3xl font-bold text-green-900">{totalItems}</p>
                <p className="text-xs text-green-500 mt-1">Total dishes</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Menu className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600 mb-1">Subscription</p>
                <p className="text-3xl font-bold text-purple-900">
                  {activeSubscription ? `${daysLeft}d` : 'Expired'}
                </p>
                <p className="text-xs text-purple-500 mt-1">
                  {activeSubscription ? 'Days remaining' : 'Renew now'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* QR Code Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="w-6 h-6 text-indigo-600" />
              Your QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="space-y-6">
                {qrGenerated ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-20"></div>
                    <img 
                      src={generateQRCode(menuUrl, 200)} 
                      alt="QR Code"
                      className="relative mx-auto w-48 h-48 border-4 border-white rounded-2xl shadow-xl"
                    />
                  </div>
                ) : (
                  <div className="mx-auto w-48 h-48 border-2 border-dashed border-indigo-300 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <QrCode className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-1">QR Code</div>
                      <div className="text-xs text-gray-500">Click generate to create</div>
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Menu URL:</p>
                  <p className="text-sm text-gray-700 break-all font-mono">
                    {menuUrl}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {!qrGenerated ? (
                    <Button onClick={handleGenerateQR} className="flex-1" size="lg">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleGenerateQR} variant="outline" className="flex-1">
                        <QrCode className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button onClick={handleDownloadQR} className="flex-1" variant="success">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start h-12 text-left"
              onClick={() => window.location.href = '/dashboard/menu'}
              size="lg"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Menu className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Manage Menu</div>
                <div className="text-xs opacity-75">Add categories and items</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-left"
              onClick={() => window.location.href = '/dashboard/subscription'}
              size="lg"
            >
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">View Subscription</div>
                <div className="text-xs opacity-75">Manage your plan</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-left"
              onClick={() => {
                const url = `/r/${restaurant?.slug || 'demo-restaurant'}`;
                window.open(url, '_blank');
              }}
              size="lg"
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Preview Menu</div>
                <div className="text-xs opacity-75">See customer view</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Alert */}
      {activeSubscription && daysLeft <= 7 && (
        <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">
                    Subscription Expiring Soon
                  </h3>
                  <p className="text-orange-800">
                    Your subscription expires in {daysLeft} days.
                  </p>
                </div>
              </div>
              <Button variant="warning" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Renew Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;