import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, ToggleLeft, ToggleRight, CheckCircle, XCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { menuAPI } from '@/services/api';
import toast from 'react-hot-toast';

const MenuAvailability = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const { data: menuData, isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: menuAPI.getMenu,
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ item, available }) => {
      const formData = new FormData();
      formData.append('name', item.name);
      formData.append('description', item.description || '');
      formData.append('price', item.price);
      formData.append('available', available);
      formData.append('order', item.order || 0);
      return menuAPI.updateMenuItem(item.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      toast.success('Item updated!');
    },
    onError: () => toast.error('Failed to update item'),
  });

  const toggleItem = (item) => {
    updateItemMutation.mutate({ item, available: !item.available });
  };

  const toggleAll = (available) => {
    const items = categories.flatMap(cat => cat.menuItems || []);
    items.forEach(item => {
      if (item.available !== available) {
        updateItemMutation.mutate({ item, available });
      }
    });
  };

  const categories = menuData?.data?.restaurant?.categories || [];
  const allItems = categories.flatMap(cat => cat.menuItems || []);
  const availableCount = allItems.filter(item => item.available).length;
  
  // Filter categories and items based on search
  const filteredCategories = categories.map(category => ({
    ...category,
    menuItems: category.menuItems?.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []
  })).filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.menuItems.length > 0
  );

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Menu Availability
        </h1>
        <p className="text-gray-600 flex items-center justify-center gap-2">
          <Package className="w-5 h-5 text-green-500" />
          Control which items are visible to customers
        </p>
      </div>

      {/* Search */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search menu items or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Global Controls */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Global Controls</span>
            <span className="text-sm font-normal text-gray-600">
              {availableCount} of {allItems.length} items available
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant="success" 
              onClick={() => toggleAll(true)}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Enable All Items
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => toggleAll(false)}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Disable All Items
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {filteredCategories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-600" />
              {category.name}
              <span className="text-sm font-normal text-gray-500">
                ({category.menuItems?.filter(item => item.available).length || 0} of {category.menuItems?.length || 0} available)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {category.menuItems?.length > 0 ? (
              <div className="space-y-3">
                {category.menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">₹{parseFloat(item.price).toFixed(0)}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleItem(item)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        item.available 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {item.available ? (
                        <>
                          <ToggleRight className="w-6 h-6" />
                          <span className="font-medium">Available</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6" />
                          <span className="font-medium">Unavailable</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No items in this category</p>
            )}
          </CardContent>
        </Card>
      ))}

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items</h3>
            <p className="text-gray-600">Add some categories and items first</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuAvailability;