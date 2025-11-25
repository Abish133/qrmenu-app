import React from 'react';
import { cn } from '@/utils/cn';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    outline: 'border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 hover:border-gray-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
    ghost: 'hover:bg-gray-100 text-gray-900 hover:shadow-md transform hover:-translate-y-0.5',
    link: 'text-blue-600 underline-offset-4 hover:underline hover:text-blue-700',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    warning: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
  };

  const sizes = {
    default: 'h-11 px-6 py-2.5',
    sm: 'h-9 px-4 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-11 w-11',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:transform-none',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };