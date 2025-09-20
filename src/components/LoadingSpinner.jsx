import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = '', fullScreen = false, className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className={`${sizeClasses[size]} text-dental-blue animate-spin mx-auto mb-4`} />
          {text && (
            <p className={`${textSizes[size]} text-dental-gray font-medium`}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} text-dental-blue animate-spin mx-auto ${text ? 'mb-2' : ''}`} />
        {text && (
          <p className={`${textSizes[size]} text-dental-gray font-medium`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;