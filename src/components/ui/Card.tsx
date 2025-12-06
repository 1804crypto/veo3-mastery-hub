import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default React.memo(Card);