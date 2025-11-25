import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Edit, Save, X, Plus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { adminAPI } from '@/services/api';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

const AdminSubscriptionSettings = () => {
  const { user } = useAuthStore();
  const [editingPlan, setEditingPlan] = useState(null);
  const [editForm, setEditForm] = useState({});
  const queryClient = useQueryClient();

  // Debug: Log user info
  console.log('Current user:', user);
  console.log('User role:', user?.role);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Current role: {user?.role || 'No user'}</p>
        </div>
      </div>
    );
  }

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['admin-subscription-plans'],
    queryFn: adminAPI.getSubscriptionPlans,
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, data }) => adminAPI.updateSubscriptionPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-subscription-plans']);
      setEditingPlan(null);
      setEditForm({});
      toast.success('Plan updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update plan');
    },
  });

  const handleEdit = (plan) => {
    setEditingPlan(plan.id);
    setEditForm({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features?.join('\n') || '',
      badgeText: plan.badgeText || '',
      badgeColor: plan.badgeColor || 'blue',
      badgeEnabled: plan.badgeEnabled || false
    });
  };

  const handleSave = () => {
    const featuresArray = editForm.features.split('\n').filter(f => f.trim());
    updatePlanMutation.mutate({
      id: editingPlan,
      data: {
        ...editForm,
        features: featuresArray,
        price: parseFloat(editForm.price),
        duration: parseInt(editForm.duration)
      }
    });
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setEditForm({});
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  const plans = plansData?.data?.plans || [];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Subscription Settings
        </h1>
        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          Manage subscription plans and pricing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-t-2xl">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-800 capitalize">{plan.name} Plan</div>
                    <div className="text-sm text-gray-600">Subscription plan settings</div>
                  </div>
                </div>
                {editingPlan === plan.id ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updatePlanMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {editingPlan === plan.id ? (
                <div className="space-y-6">
                  <FormField label="Plan Name" required>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="e.g., monthly, yearly"
                    />
                  </FormField>

                  <FormField label="Price (₹)" required>
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      placeholder="499.00"
                    />
                  </FormField>

                  <FormField label="Duration (Days)" required>
                    <Input
                      type="number"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                      placeholder="30"
                    />
                  </FormField>

                  <FormField label="Features (One per line)">
                    <textarea
                      value={editForm.features}
                      onChange={(e) => setEditForm({...editForm, features: e.target.value})}
                      className="w-full h-32 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 resize-none"
                      placeholder="Unlimited menu items&#10;QR code generation&#10;Mobile responsive menu"
                    />
                  </FormField>

                  <FormField label="Badge Settings">
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="badgeEnabled"
                        checked={editForm.badgeEnabled}
                        onChange={(e) => setEditForm({...editForm, badgeEnabled: e.target.checked})}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="badgeEnabled" className="text-sm font-medium text-gray-700">
                        Enable Badge
                      </label>
                    </div>
                    {editForm.badgeEnabled && (
                      <div className="space-y-4">
                        <Input
                          value={editForm.badgeText}
                          onChange={(e) => setEditForm({...editForm, badgeText: e.target.value})}
                          placeholder="e.g., Christmas Offer, Diwali Special"
                        />
                        <select
                          value={editForm.badgeColor}
                          onChange={(e) => setEditForm({...editForm, badgeColor: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="blue">Blue</option>
                          <option value="red">Red</option>
                          <option value="green">Green</option>
                          <option value="purple">Purple</option>
                          <option value="orange">Orange</option>
                          <option value="pink">Pink</option>
                        </select>
                      </div>
                    )}
                  </FormField>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-lg">₹</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Price</p>
                      <p className="text-2xl font-bold text-gray-900">₹{plan.price}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-sm">{plan.duration}d</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Duration</p>
                      <p className="text-2xl font-bold text-gray-900">{plan.duration} days</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {plan.features?.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    plan.isActive 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <p className="font-semibold">
                      Status: {plan.isActive ? '✅ Active' : '❌ Inactive'}
                    </p>
                  </div>

                  {plan.badgeEnabled && plan.badgeText && (
                    <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                      <p className="font-semibold text-yellow-800 mb-2">Badge Preview:</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                        plan.badgeColor === 'red' ? 'bg-red-500' :
                        plan.badgeColor === 'green' ? 'bg-green-500' :
                        plan.badgeColor === 'purple' ? 'bg-purple-500' :
                        plan.badgeColor === 'orange' ? 'bg-orange-500' :
                        plan.badgeColor === 'pink' ? 'bg-pink-500' :
                        'bg-blue-500'
                      }`}>
                        {plan.badgeText}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Need More Plans?</h3>
          <p className="text-gray-600 mb-6">
            Contact the development team to add new subscription plans or modify existing ones.
          </p>
          <Button variant="outline" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Request New Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptionSettings;