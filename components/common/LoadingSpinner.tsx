
import React from 'react';
import { getText } from '../../constants'; 
import { Language, UIStringKeys } from '../../types'; 

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; 
  lang?: Language; 
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-[#36A7B7]', lang = Language.EN }) => { 
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin-slow rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${color}`} role="status">
      <span className="sr-only">{getText(lang, UIStringKeys.LoadingSpinnerSR)}</span>
    </div>
  );
};

export default LoadingSpinner;
