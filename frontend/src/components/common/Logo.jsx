import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', linkTo = '/' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const content = (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
        <img src="/logo.svg" alt="Vyntra Icon" className="w-full h-full drop-shadow-md" />
      </div>
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight gradient-text ${textSizes[size]}`}>
          Vyntra
        </span>
        {size === 'xl' && (
          <span className="text-xs text-gray-500 dark:text-gray-400 tracking-wider uppercase font-semibold">
            Connect. Create. Share.
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
