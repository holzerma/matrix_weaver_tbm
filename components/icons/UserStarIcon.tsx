import React from 'react';

const UserStarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        <path d="M19.5 13.5L21 12l-1.5-1.5L21 9l-1.5-1.5-1.5 1.5L16.5 9l-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5z" />
    </svg>
);

export default UserStarIcon;