import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  icon,
  onClick,
  className = '' 
}) => {
  return (
    <div 
      className={`card ${onClick ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {(title || icon) && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};
