import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full rounded-btn border border-mist px-4 py-2.5 text-sm text-ink placeholder-slate-body focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue ${className}`}
      {...props}
    />
  );
};

export default Input;
