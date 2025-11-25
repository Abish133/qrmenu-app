import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, CreditCard, User, X, Shield, Settings, ToggleLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/authStore';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ...(user?.role === 'restaurant' ? [
      { icon: Menu, label: 'Menu Management', path: '/dashboard/menu' },
      { icon: ToggleLeft, label: 'Menu Availability', path: '/dashboard/availability' },
      { icon: CreditCard, label: 'Subscription', path: '/dashboard/subscription' },
    ] : []),
    ...(user?.role === 'admin' ? [
      { icon: Settings, label: 'Subscription Settings', path: '/dashboard/admin/subscription-settings' },
    ] : []),
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4">
          {/* Mobile close button */}
          <div className="flex justify-end mb-4 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;