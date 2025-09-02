
import React from 'react';
import LoadingSpinner from './LoadingSpinner'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, icon, className, ...rest }) => {
  const baseStyles = "px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed font-['Montserrat']";
  
  const variantStyles = {
    primary: "bg-[#F54963] hover:bg-[#D43A50] text-white focus:ring-[#F54963]", // LLYC Red
    secondary: "bg-[#878E90] hover:bg-[#6D7475] text-white focus:ring-[#878E90]", // LLYC Gris 02/01
    danger: "bg-red-700 hover:bg-red-800 text-white focus:ring-red-600", // A darker red for danger, LLYC red is primary
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : icon}
      <span>{children}</span>
    </button>
  );
};

export default Button;