import React from 'react';

const VARIANT_CLASSES = {
  primary: 'bg-brand-blue text-white shadow-brand hover:bg-blue-700',
  secondary: 'bg-white text-ink border border-mist hover:bg-gray-50',
  accent: 'bg-brand-violet text-white shadow-brand hover:bg-purple-700',
  ghost: 'bg-transparent text-brand-blue hover:bg-sky-tint-1',
  'outline-inverse': 'bg-transparent border border-white text-white hover:bg-white hover:text-brand-blue',
};

const Button = ({
  variant = 'primary',
  as: Component = 'button',
  className = '',
  children,
  ...props
}) => {
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;

  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors duration-200 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
