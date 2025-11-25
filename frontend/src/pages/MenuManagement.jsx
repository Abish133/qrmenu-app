import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Image, Package, Eye, EyeOff, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { MultiImageUpload } from '@/components/ui/MultiImageUpload';
import { ImageSlider } from '@/components/ui/ImageSlider';
import { Modal } from '@/components/ui/Modal';
import { menuAPI } from '@/services/api';
import toast from 'react-hot-toast';

const MenuManagement = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', order: 0 });
  const [itemFormData, setItemFormData] = useState({ name: '', description: '', price: '', available: true, order: 0, isVeg: true });
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  
  const queryClient = useQueryClient();

  const { data: menuData, isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: menuAPI.getMenu,
  });

  const createCategoryMutation = useMutation({
    mutationFn: menuAPI.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryFormData({ name: '', order: 0 });
      toast.success('Category saved successfully');
    },
    onError: () => toast.error('Failed to save category'),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => menuAPI.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryFormData({ name: '', order: 0 });
      toast.success('Category updated successfully');
    },
    onError: () => toast.error('Failed to update category'),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }) => {
      console.log('Updating item with data:', data);
      return menuAPI.updateMenuItem(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      resetForm();
      toast.success('✨ Menu item updated successfully!');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update menu item');
    },
  });

  const createItemMutation = useMutation({
    mutationFn: menuAPI.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      resetForm();
      toast.success('✨ Menu item created successfully!');
    },
    onError: () => toast.error('Failed to create menu item'),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: menuAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      toast.success('Category deleted successfully');
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const deleteItemMutation = useMutation({
    mutationFn: menuAPI.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['menu']);
      toast.success('Menu item deleted successfully');
    },
    onError: () => toast.error('Failed to delete menu item'),
  });

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const data = {
      name: categoryFormData.name,
      order: parseInt(categoryFormData.order) || 0,
    };
    
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({ name: category.name, order: category.order });
    setShowCategoryForm(true);
  };

  const handleEditItem = (item) => {
    console.log('Editing item:', item);
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      available: item.available,
      order: item.order.toString(),
      isVeg: item.isVeg !== undefined ? item.isVeg : true
    });
    // Set existing images for editing
    const existingImages = item.images?.length > 0 ? item.images : (item.image ? [item.image] : []);
    setSelectedFile(existingImages.map(img => ({ url: img, isNew: false })));
    setSelectedCategory(item.categoryId);
    setShowItemForm(true);
  };

  const handleItemSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Add all form fields
    formData.append('name', itemFormData.name);
    formData.append('description', itemFormData.description || '');
    formData.append('price', parseFloat(itemFormData.price));
    formData.append('available', itemFormData.available === true || itemFormData.available === 'true');
    formData.append('order', parseInt(itemFormData.order) || 0);
    formData.append('isVeg', itemFormData.isVeg === true || itemFormData.isVeg === 'true');
    
    // Add categoryId for new items
    if (!editingItem) {
      formData.append('categoryId', selectedCategory);
    }
    
    // Handle multiple images
    if (selectedFile && Array.isArray(selectedFile)) {
      selectedFile.forEach((imageObj) => {
        if (imageObj.file && imageObj.isNew) {
          console.log('Adding new image file:', imageObj.file.name);
          formData.append('images', imageObj.file);
        }
      });
    } else if (selectedFile instanceof File) {
      console.log('Adding single file:', selectedFile.name);
      formData.append('images', selectedFile);
    }
    
    // Log form data for debugging
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }
    
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createItemMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setShowItemForm(false);
    setSelectedCategory(null);
    setEditingItem(null);
    setItemFormData({ name: '', description: '', price: '', available: true, order: 0, isVeg: true });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const categories = menuData?.data?.restaurant?.categories || [];
  
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

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Menu Management
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Organize your menu categories and items
          </p>
        </div>
        <Button onClick={() => setShowCategoryForm(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </Button>
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

      {/* Category Modal */}
      <Modal 
        isOpen={showCategoryForm} 
        onClose={() => {
          setShowCategoryForm(false);
          setEditingCategory(null);
          setCategoryFormData({ name: '', order: 0 });
        }}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-6">
          <FormField label="Category Name" required>
            <Input
              value={categoryFormData.name}
              onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
              placeholder="Enter category name (e.g., Appetizers, Main Courses)"
              required
            />
          </FormField>
          
          <FormField label="Display Order">
            <Input
              type="number"
              value={categoryFormData.order}
              onChange={(e) => setCategoryFormData({...categoryFormData, order: e.target.value})}
              placeholder="Order number (optional, lower numbers appear first)"
              min="0"
            />
          </FormField>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              className="flex-1"
            >
              {(createCategoryMutation.isPending || updateCategoryMutation.isPending) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setShowCategoryForm(false);
                setEditingCategory(null);
                setCategoryFormData({ name: '', order: 0 });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Menu Item Modal */}
      <Modal 
        isOpen={showItemForm} 
        onClose={resetForm}
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
        size="lg"
      >
        <form onSubmit={handleItemSubmit} className="space-y-6">
          <FormField label="Item Name" required>
            <Input
              value={itemFormData.name}
              onChange={(e) => setItemFormData({...itemFormData, name: e.target.value})}
              placeholder="Enter item name (e.g., Grilled Salmon, Caesar Salad)"
              required
            />
          </FormField>
          
          <FormField label="Description">
            <textarea
              value={itemFormData.description}
              onChange={(e) => setItemFormData({...itemFormData, description: e.target.value})}
              placeholder="Describe your dish, ingredients, or special preparation (optional)"
              className="w-full h-24 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 resize-none"
              rows="3"
            />
          </FormField>
          
          <FormField label="Price" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-semibold">₹</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={itemFormData.price}
                onChange={(e) => setItemFormData({...itemFormData, price: e.target.value})}
                placeholder="0.00"
                className="pl-11"
                required
              />
            </div>
          </FormField>
          
          <MultiImageUpload
            label="Item Images"
            currentImages={selectedFile || []}
            onImagesSelect={(images) => {
              console.log('Images selected:', images);
              setSelectedFile(images);
            }}
            maxImages={5}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Food Type">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  checked={itemFormData.isVeg}
                  onChange={(e) => setItemFormData({...itemFormData, isVeg: e.target.checked})}
                  className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${itemFormData.isVeg ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full bg-white m-0.5 ${itemFormData.isVeg ? 'block' : 'hidden'}`}></div>
                  </div>
                  <label className="text-sm font-medium text-gray-700">
                    {itemFormData.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                  </label>
                </div>
              </div>
            </FormField>
            
            <FormField label="Availability">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  checked={itemFormData.available}
                  onChange={(e) => setItemFormData({...itemFormData, available: e.target.checked})}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  {itemFormData.available ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-500" />
                  )}
                  <label className="text-sm font-medium text-gray-700">
                    {itemFormData.available ? 'Available' : 'Hidden'}
                  </label>
                </div>
              </div>
            </FormField>
            
            <FormField label="Display Order">
              <Input
                type="number"
                min="0"
                value={itemFormData.order}
                onChange={(e) => setItemFormData({...itemFormData, order: e.target.value})}
                placeholder="Order number"
              />
            </FormField>
          </div>
          
          <div className="flex space-x-3 pt-6">
            <Button 
              type="submit" 
              disabled={createItemMutation.isPending || updateItemMutation.isPending}
              className="flex-1"
              variant="success"
            >
              {(createItemMutation.isPending || updateItemMutation.isPending) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update Item' : 'Create Item'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Categories and Items */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {category.menuItems?.length || 0} items
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowItemForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Delete this category and all its items?')) {
                        deleteCategoryMutation.mutate(category.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {category.menuItems?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.menuItems.map((item) => (
                    <div key={item.id} className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full border ${item.isVeg ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'}`}>
                            {item.isVeg && <div className="w-1.5 h-1.5 rounded-full bg-white m-0.75"></div>}
                          </div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEditItem(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Delete this menu item?')) {
                                deleteItemMutation.mutate(item.id);
                              }
                            }}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {(item.images?.length > 0 || item.image) && (
                        <div className="mb-3">
                          <ImageSlider
                            images={item.images?.length > 0 ? item.images : [item.image]}
                            alt={item.name}
                            className="w-full h-32"
                          />
                        </div>
                      )}
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          ₹{parseFloat(item.price).toFixed(0)}
                        </span>
                        <div className="flex items-center gap-2">
                          {item.available ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              <Eye className="w-3 h-3" />
                              Available
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-500 mb-4">Start adding delicious items to this category</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowItemForm(true);
                    }}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && searchTerm && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="text-center py-16">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try searching with different keywords</p>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 && !searchTerm && (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No categories yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start building your digital menu by creating your first category. 
              Categories help organize your menu items like "Appetizers", "Main Courses", or "Desserts".
            </p>
            <Button onClick={() => setShowCategoryForm(true)} size="lg">
              <Sparkles className="h-5 w-5 mr-2" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuManagement;