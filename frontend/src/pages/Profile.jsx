import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { User, Building, Download, ExternalLink, Sparkles, QrCode, Eye, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { authAPI } from '@/services/api';
import useAuthStore from '@/store/authStore';
import { generateQRCode, downloadQRCode, downloadQRWithText, downloadQRPDF } from '@/services/qrService';
import { QRCodeWithText } from '@/components/ui/QRCodeWithText';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, restaurant, updateUser, updateRestaurant } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: authAPI.getProfile,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      restaurantName: restaurant?.name || '',
      address: restaurant?.address || '',
      themeColor: restaurant?.themeColor || '#3B82F6'
    }
  });

  const themeColor = watch('themeColor');

  // Set form values when data loads
  React.useEffect(() => {
    if (profileData?.data) {
      const { user: userData, restaurant: restaurantData } = profileData.data;
      setValue('name', userData.name);
      setValue('email', userData.email);
      if (restaurantData) {
        setValue('restaurantName', restaurantData.name);
        setValue('address', restaurantData.address || '');
        setValue('themeColor', restaurantData.themeColor || '#3B82F6');
      }
    }
  }, [profileData, setValue]);

  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (response) => {
      updateUser(response.data.user);
      updateRestaurant(response.data.restaurant);
      queryClient.invalidateQueries(['profile']);
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Profile
        </h1>
        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          Manage your account and restaurant information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Information */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-2xl">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-blue-800">User Information</div>
                <div className="text-sm text-blue-600">Your personal details</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                label="Full Name"
                error={errors.name?.message}
                required
              >
                <Input
                  placeholder="Enter your full name"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
              </FormField>

              <FormField
                label="Email Address"
                error={errors.email?.message}
                required
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </FormField>

              <FormField
                label="Account Role"
              >
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700 capitalize">{user?.role || 'restaurant'}</span>
                </div>
              </FormField>
            </form>
          </CardContent>
        </Card>

        {/* Restaurant Information */}
        {restaurant && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-2xl">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-green-800">Restaurant Information</div>
                  <div className="text-sm text-green-600">Your business details</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <FormField
                  label="Restaurant Name"
                  error={errors.restaurantName?.message}
                  required
                >
                  <Input
                    placeholder="Enter your restaurant name"
                    {...register('restaurantName', {
                      required: 'Restaurant name is required'
                    })}
                  />
                </FormField>

                <FormField
                  label="Address"
                >
                  <textarea
                    {...register('address')}
                    className="w-full h-24 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 resize-none"
                    rows="3"
                    placeholder="Enter your restaurant address (optional)"
                  />
                </FormField>

                <FormField
                  label="Restaurant Slug"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-mono text-gray-700">{restaurant.slug}</span>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-1">Public Menu URL:</p>
                      <p className="text-sm text-blue-600 font-mono break-all">
                        {window.location.origin}/r/{restaurant.slug}
                      </p>
                    </div>
                  </div>
                </FormField>

                <FormField
                  label="Theme Color"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setValue('themeColor', e.target.value)}
                        className="w-16 h-12 border-2 border-gray-300 rounded-xl cursor-pointer"
                      />
                      <Palette className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                    </div>
                    <Input
                      value={themeColor}
                      onChange={(e) => setValue('themeColor', e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </FormField>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* QR Code Section */}
      {restaurant && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-2xl">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-purple-800">QR Code</div>
                <div className="text-sm text-purple-600">Your digital menu access</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30"></div>
                  <QRCodeWithText 
                    url={`${window.location.origin}/r/${restaurant.slug}`}
                    restaurantName={restaurant.name}
                    className="relative w-40 h-52 border-4 border-white rounded-2xl shadow-xl"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Your Menu QR Code
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Customers can scan this QR code to instantly view your digital menu on their mobile devices.
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Menu URL:</p>
                  <p className="text-sm text-gray-600 font-mono break-all">
                    {window.location.origin}/r/{restaurant.slug}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="success"
                    className="flex-1"
                    onClick={async () => {
                      try {
                        await downloadQRWithText(`${window.location.origin}/r/${restaurant.slug}`, restaurant.name, `${restaurant.name}-qr-code`);
                        toast.success('✨ QR Code downloaded!');
                      } catch (error) {
                        toast.error('Failed to download QR Code');
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={async () => {
                      try {
                        await downloadQRPDF(`${window.location.origin}/r/${restaurant.slug}`, restaurant.name, `${restaurant.name}-qr-code`);
                        toast.success('✨ PDF downloaded!');
                      } catch (error) {
                        toast.error('Failed to download PDF');
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(`/r/${restaurant.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Menu
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={updateProfileMutation.isPending}
          size="lg"
          className="px-12"
        >
          {updateProfileMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving Changes...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Profile;