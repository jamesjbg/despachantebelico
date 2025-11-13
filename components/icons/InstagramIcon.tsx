
import React from 'react';

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="5" fill="currentColor"/>
    <circle cx="18.5" cy="5.5" r="1.5" fill="currentColor"/>
  </svg>
);
