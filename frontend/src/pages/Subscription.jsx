import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Calendar, CheckCircle, Crown, Sparkles, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { subscriptionAPI } from '@/services/api';
import toast from 'react-hot-toast';

// Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Subscription = () => {
  const queryClient = useQueryClient();

  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: subscriptionAPI.getSubscription,
    retry: 1,
    onError: (error) => {
      console.error('Subscription fetch error:', error);
    }
  });

  const { data: plansData } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionAPI.getPlans
  });

  const createOrderMutation = useMutation({
    mutationFn: subscriptionAPI.createOrder,
    onSuccess: async (response) => {
      const { orderId, amount, currency, keyId } = response.data;
      
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'QRMenu Cloud',
        description: 'Subscription Payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            await subscriptionAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: currentPlanId
            });
            queryClient.invalidateQueries(['subscription']);
            toast.success('🎉 Subscription activated successfully!');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Restaurant Owner',
          email: 'owner@restaurant.com'
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create order');
    },
  });

  let currentPlanId = '';

  const handleCreateSubscription = (planId) => {
    currentPlanId = planId;
    createOrderMutation.mutate({ planId });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  const activeSubscription = subscriptionData?.data?.activeSubscription;
  const subscriptionHistory = subscriptionData?.data?.subscriptionHistory || [];
  const plans = plansData?.data?.plans || [];
  
  // Calculate savings for yearly plans
  const calculateSavings = (plan) => {
    if (plan.duration >= 365) { // Yearly plan
      const monthlyPlan = plans.find(p => p.duration <= 31); // Find monthly plan
      if (monthlyPlan) {
        const yearlyEquivalent = (monthlyPlan.price * 12);
        const savings = yearlyEquivalent - plan.price;
        return savings > 0 ? savings : 0;
      }
    }
    return 0;
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = activeSubscription ? getDaysRemaining(activeSubscription.endDate) : 0;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Subscription
        </h1>
        <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
          <Crown className="w-5 h-5 text-purple-500" />
          Manage your QRMenu Cloud subscription
        </p>
      </div>

      {/* Current Subscription */}
      {activeSubscription ? (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-2xl">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-green-800">Active Subscription</div>
                <div className="text-sm text-green-600">Your digital menu is live!</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Plan</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{activeSubscription.plan}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Price</p>
                <p className="text-xl font-bold text-gray-900">₹{activeSubscription.price}</p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                  daysRemaining <= 7 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 
                  daysRemaining <= 30 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                  'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}>
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Days Left</p>
                <p className={`text-xl font-bold ${
                  daysRemaining <= 7 ? 'text-red-600' :
                  daysRemaining <= 30 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {daysRemaining} days
                </p>
                <p className="text-xs text-gray-500">
                  Expires: {new Date(activeSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* Subscription Status Badge */}
            <div className={`mt-8 p-6 rounded-2xl border ${
              daysRemaining <= 7 ? 'bg-gradient-to-r from-red-100 to-orange-100 border-red-200' :
              daysRemaining <= 30 ? 'bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200' :
              'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {daysRemaining <= 7 ? (
                    <>
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">!</span>
                      </div>
                      <div>
                        <p className="text-red-800 font-bold">⚠️ Subscription Expiring Soon!</p>
                        <p className="text-red-700 text-sm">Only {daysRemaining} days left. Renew now to avoid service interruption.</p>
                      </div>
                    </>
                  ) : daysRemaining <= 30 ? (
                    <>
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-orange-800 font-bold">📅 Renewal Reminder</p>
                        <p className="text-orange-700 text-sm">{daysRemaining} days remaining. Consider renewing your subscription.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-green-800 font-bold">✅ Subscription Active</p>
                        <p className="text-green-700 text-sm">Your digital menu is live! {daysRemaining} days remaining.</p>
                      </div>
                    </>
                  )}
                </div>
                {daysRemaining <= 30 && (
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    daysRemaining <= 7 ? 'bg-red-500 text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    {daysRemaining} days left
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-400 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              No Active Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Your Plan</h3>
            <p className="text-gray-600 mb-6">
              You don't have an active subscription. Choose a plan below to activate your digital menu.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <div key={plan.id} className="relative">
            {/* Custom Badge - Center Top */}
            {plan.badgeEnabled && plan.badgeText && (
              <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 px-4 py-2 rounded-xl text-sm font-bold shadow-2xl text-white border-2 border-white/30 backdrop-blur-sm ${
                plan.badgeColor === 'red' ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700' :
                plan.badgeColor === 'green' ? 'bg-gradient-to-br from-green-500 via-green-600 to-green-700' :
                plan.badgeColor === 'purple' ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700' :
                plan.badgeColor === 'orange' ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700' :
                plan.badgeColor === 'pink' ? 'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700' :
                'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
              } animate-pulse`}>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 animate-spin" style={{animationDuration: '3s'}} />
                  <span className="drop-shadow-sm">{plan.badgeText}</span>
                </div>
              </div>
            )}
            
            {/* Savings Badge - Right Top */}
            {calculateSavings(plan) > 0 && (
              <div className="absolute -top-4 -right-4 z-20 transform rotate-12 px-4 py-2 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white rounded-xl text-sm font-bold shadow-2xl border-2 border-white/30 backdrop-blur-sm animate-bounce" style={{animationDuration: '2s'}}>
                <div className="flex items-center gap-1">
                  <span className="text-lg">💰</span>
                  <span className="drop-shadow-sm">Save ₹{calculateSavings(plan)}</span>
                </div>
              </div>
            )}
            <Card className={`bg-gradient-to-br ${index === 0 ? 'from-blue-50 to-indigo-50 border-blue-200' : 'from-purple-50 to-pink-50 border-purple-300'} border-2 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
            <CardHeader className={`bg-gradient-to-r ${index === 0 ? 'from-blue-100 to-indigo-100' : 'from-purple-100 to-pink-100'} rounded-t-2xl relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${index === 0 ? 'bg-blue-300' : 'bg-purple-300'} rounded-full transform translate-x-16 -translate-y-16 opacity-20`}></div>
              <CardTitle className="flex items-center gap-3 relative z-10">
                <div className={`w-12 h-12 bg-gradient-to-r ${index === 0 ? 'from-blue-500 to-indigo-500' : 'from-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center`}>
                  {index === 0 ? <Zap className="h-6 w-6 text-white" /> : <Crown className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <div className={`text-xl font-bold ${index === 0 ? 'text-blue-800' : 'text-purple-800'} capitalize`}>{plan.name} Plan</div>
                  <div className={`text-sm ${index === 0 ? 'text-blue-600' : 'text-purple-600'}`}>{plan.duration} days subscription</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className={`text-5xl font-bold bg-gradient-to-r ${index === 0 ? 'from-blue-600 to-indigo-600' : 'from-purple-600 to-pink-600'} bg-clip-text text-transparent mb-2`}>₹{plan.price}</div>
                <p className="text-gray-600 text-lg">for {plan.duration} days</p>
                {calculateSavings(plan) > 0 && (
                  <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    💰 Save ₹{calculateSavings(plan)} vs Monthly
                  </div>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features?.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleCreateSubscription(plan.name)}
                disabled={createOrderMutation.isPending}
                className={`w-full ${index === 0 ? '' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'}`}
                size="lg"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {index === 0 ? <Sparkles className="w-4 h-4 mr-2" /> : <Crown className="w-4 h-4 mr-2" />}
                    Choose {plan.name}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>

      {/* Subscription History */}
      {subscriptionHistory.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-t-2xl">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              Subscription History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {subscriptionHistory.map((subscription) => (
                <div key={subscription.id} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg capitalize text-gray-900">{subscription.plan} Plan</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-2">₹{subscription.price}</p>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        subscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subscription;