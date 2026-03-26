import React from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  backgroundImage?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
}) => {
  return (
    <section className="hero-modern">
      {backgroundImage && (
        <div 
          className="hero-background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      <div className="hero-overlay" />
      
      <div className="hero-content">
        {subtitle && (
          <span className="hero-subtitle animate-fade-in-down">
            {subtitle}
          </span>
        )}
        
        <h1 className="hero-title animate-fade-in-up">
          {title}
        </h1>
        
        {description && (
          <p className="hero-description animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {description}
          </p>
        )}
        
        {(primaryAction || secondaryAction) && (
          <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {primaryAction && (
              <button 
                className="btn-modern btn-primary btn-lg hover-lift"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button 
                className="btn-modern btn-secondary btn-lg hover-lift"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="hero-decoration">
        <div className="decoration-circle decoration-1" />
        <div className="decoration-circle decoration-2" />
        <div className="decoration-circle decoration-3" />
      </div>
    </section>
  );
};
