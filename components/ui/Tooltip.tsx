import React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-bubble">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;