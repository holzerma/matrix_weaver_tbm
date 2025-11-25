
import React from 'react';

const TowerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16" />
    <path d="M6 22V8l4-4 4 4v14" />
    <path d="M10 8V4" />
    <path d="M14 12h-4" />
    <path d="M18 22V10l-4-4" />
  </svg>
);

export default TowerIcon;
