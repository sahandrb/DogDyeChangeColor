import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading, className = '', ...props }) => {
  return (
    <button
      className={`
        relative w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg overflow-hidden
        transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
        bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Shine effect overlay */}
      <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-500 pointer-events-none"></div>
      
      <span className="relative flex items-center justify-center gap-2 drop-shadow-md">
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            در حال طراحی...
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
};