import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  overlay?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text, 
  overlay = false, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spinnerElement = (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]}`}></div>
  );

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {spinnerElement}
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loading;
