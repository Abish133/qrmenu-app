import React from 'react';
import { useForm } from 'react-hook-form';
import { Shield, User, Mail, Lock, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import api from '@/services/api';
import toast from 'react-hot-toast';

const CreateAdmin = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/admin/create-admin', data);
      toast.success('Admin created successfully!');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white shadow-2xl border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-t-2xl">
          <CardTitle className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">Create Admin</div>
              <div className="text-sm text-purple-600">Platform Administrator</div>
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
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Enter admin name"
                  className="pl-11"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
              </div>
            </FormField>

            <FormField
              label="Email Address"
              error={errors.email?.message}
              required
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter admin email"
                  className="pl-11"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
            </FormField>

            <FormField
              label="Password"
              error={errors.password?.message}
              required
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  className="pl-11"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
              </div>
            </FormField>

            <FormField
              label="Admin Creation Key"
              error={errors.adminKey?.message}
              required
            >
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter admin creation key"
                  className="pl-11"
                  {...register('adminKey', {
                    required: 'Admin key is required'
                  })}
                />
              </div>
            </FormField>

            <Button type="submit" className="w-full" size="lg">
              <Shield className="h-4 w-4 mr-2" />
              Create Admin Account
            </Button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Admin creation requires a special key. Contact the platform owner for the admin creation key.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdmin;