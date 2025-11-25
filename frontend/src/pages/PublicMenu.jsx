import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock, AlertCircle, Package, Sparkles, Filter, Search, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { ImageSlider } from '@/components/ui/ImageSlider';
import { Modal } from '@/components/ui/Modal';
import { publicAPI } from '@/services/api';

const PublicMenu = () => {
  const { slug } = useParams();
  const [foodFilter, setFoodFilter] = useState('both'); // 'veg', 'nonveg', 'both'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['publicMenu', slug],
    queryFn: () => publicAPI.getPublicMenu(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
            <p className="text-gray-600">The restaurant you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { restaurant, subscriptionExpired } = data.data;

  if (subscriptionExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
            <p className="text-gray-600 mb-4">This restaurant's digital menu is currently inactive.</p>
            <p className="text-sm text-gray-500">Please contact the restaurant directly for menu information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const themeColor = restaurant.themeColor || '#3B82F6';

  // Filter menu items based on food type
  const filterItems = (items) => {
    if (foodFilter === 'both') return items;
    return items.filter(item => 
      foodFilter === 'veg' ? item.isVeg : !item.isVeg
    );
  };

  // Get available categories for dropdown
  const availableCategories = restaurant.categories || [];
  const filteredCategoriesForDropdown = availableCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter categories to only show those with items after filtering
  const filteredCategories = restaurant.categories?.map(category => ({
    ...category,
    menuItems: filterItems(category.menuItems || []).filter(item => 
      item.name.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(menuSearchTerm.toLowerCase()))
    )
  })).filter(category => {
    const hasItems = category.menuItems.length > 0;
    const matchesCategory = categoryFilter === 'all' || category.id.toString() === categoryFilter;
    return hasItems && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div 
        className="text-white py-12 px-4 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${themeColor}dd, ${themeColor})`
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {restaurant.logo && (
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-white rounded-full blur opacity-30"></div>
              <img 
                src={restaurant.logo} 
                alt={restaurant.name}
                className="relative w-24 h-24 rounded-full mx-auto bg-white p-3 shadow-xl"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{restaurant.name}</h1>
          {restaurant.address && (
            <div className="flex items-center justify-center text-white/90 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{restaurant.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto px-6 mt-8 mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={menuSearchTerm}
              onChange={(e) => setMenuSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white shadow-lg rounded-full border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ focusRingColor: `${themeColor}50` }}
            />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white shadow-lg rounded-full border-0 text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-xl"
            style={{ 
              background: `linear-gradient(135deg, white, ${themeColor}10)`
            }}
          >
            <Filter className="w-5 h-5" style={{ color: themeColor }} />
            <span className="font-medium">Filter</span>
            {(foodFilter !== 'both' || categoryFilter !== 'all') && (
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: themeColor }}
              ></div>
            )}
          </button>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto p-6 -mt-4">
        {filteredCategories.length > 0 ? (
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden shadow-xl border-0">
                <div 
                  className="px-8 py-6 text-white font-bold text-xl relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`
                  }}
                >
                  <div className="absolute inset-0 bg-white opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <Package className="w-6 h-6" />
                    {category.name}
                  </div>
                </div>
                <CardContent className="p-0">
                  {category.menuItems && category.menuItems.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {category.menuItems.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-4 h-4 rounded-full border-2 ${item.isVeg ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'}`}>
                                  {item.isVeg && <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>}
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{item.name}</h3>
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.description}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <span 
                                  className="text-2xl font-bold px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-blue-100"
                                  style={{ color: themeColor }}
                                >
                                  ₹{parseFloat(item.price).toFixed(0)}
                                </span>
                              </div>
                            </div>
                            {(item.images?.length > 0 || item.image) && (
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20"></div>
                                <ImageSlider
                                  images={item.images?.length > 0 ? item.images : [item.image]}
                                  alt={item.name}
                                  className="relative w-20 h-20 shadow-lg border-2 border-white"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
                      <p className="text-gray-500">This category is being updated</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-xl border-0">
            <CardContent className="text-center p-16">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-white" />
              </div>
              {restaurant.categories && restaurant.categories.length > 0 ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Items Found</h3>
                  <p className="text-gray-600 text-lg">No {foodFilter === 'veg' ? 'vegetarian' : foodFilter === 'nonveg' ? 'non-vegetarian' : ''} items available{categoryFilter !== 'all' ? ' in this category' : ''}.</p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Menu Coming Soon</h3>
                  <p className="text-gray-600 text-lg">This restaurant is still setting up their digital menu.</p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-12 bg-gradient-to-r from-gray-100 to-blue-100 mt-12">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Powered by</span>
          <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            QRMenu Cloud
          </span>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal 
        isOpen={showFilterModal} 
        onClose={() => setShowFilterModal(false)} 
        title="Filter Menu" 
        size="sm"
      >
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>{categoryFilter === 'all' ? 'All Categories' : availableCategories.find(c => c.id.toString() === categoryFilter)?.name || 'Category'}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <button
                      onClick={() => {
                        setCategoryFilter('all');
                        setShowDropdown(false);
                        setSearchTerm('');
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${categoryFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      All Categories
                    </button>
                    {filteredCategoriesForDropdown.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setCategoryFilter(category.id.toString());
                          setShowDropdown(false);
                          setSearchTerm('');
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${categoryFilter === category.id.toString() ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Food Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Food Type</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="foodFilter"
                  value="both"
                  checked={foodFilter === 'both'}
                  onChange={(e) => setFoodFilter(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">All Items</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="foodFilter"
                  value="veg"
                  checked={foodFilter === 'veg'}
                  onChange={(e) => setFoodFilter(e.target.value)}
                  className="w-4 h-4 text-green-600"
                />
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border border-green-600">
                    <div className="w-2 h-2 rounded-full bg-white m-1"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Vegetarian Only</span>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="foodFilter"
                  value="nonveg"
                  checked={foodFilter === 'nonveg'}
                  onChange={(e) => setFoodFilter(e.target.value)}
                  className="w-4 h-4 text-red-600"
                />
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 border border-red-600"></div>
                  <span className="text-sm font-medium text-gray-700">Non-Vegetarian Only</span>
                </div>
              </label>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setFoodFilter('both');
                setCategoryFilter('all');
                setSearchTerm('');
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: themeColor }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublicMenu;