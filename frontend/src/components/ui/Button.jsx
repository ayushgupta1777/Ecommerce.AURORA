import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'btn';
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
