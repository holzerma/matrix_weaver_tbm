import React from 'react';

const ResourceTowerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="14" width="18" height="7" rx="1" />
    <rect x="5" y="7" width="14" height="7" rx="1" />
    <rect x="7" y="3" width="10" height="4" rx="1" />
  </svg>
);

export default ResourceTowerIcon;
