'use client';

import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

/**
 * 再利用可能なInputコンポーネント
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const normalStyles = 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500';
  const errorStyles = 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500';
  const disabledStyles = 'bg-gray-50 text-gray-500 cursor-not-allowed';

  const inputStyles = [
    baseStyles,
    error ? errorStyles : normalStyles,
    disabled && disabledStyles,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        className={inputStyles}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';