import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}) => {
  return (
    <div className="feature-card glass hover-lift">
      <div className="feature-icon-wrapper" style={{ background: gradient }}>
        <span className="feature-icon">{icon}</span>
      </div>
      
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      
      <div className="feature-glow" style={{ background: gradient }} />
    </div>
  );
};
