
import React from 'react';

const StreamIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 6.5A3.5 3.5 0 0 1 8.5 3H12h3.5a3.5 3.5 0 0 1 0 7H12" />
    <path d="M19 17.5a3.5 3.5 0 0 1-3.5 3.5H12h-3.5a3.5 3.5 0 0 1 0-7H12" />
    <path d="M12 3v18" />
  </svg>
);

export default StreamIcon;
