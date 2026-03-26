import React from 'react';

interface PricingCardProps {
  name: string;
  price: string | number;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period = 'month',
  features,
  highlighted = false,
  ctaLabel = 'Get Started',
  onCtaClick,
}) => {
  return (
    <div className={`pricing-card glass hover-lift ${highlighted ? 'highlighted' : ''}`}>
      {highlighted && (
        <div className="pricing-badge">Most Popular</div>
      )}
      
      <div className="pricing-header">
        <h3 className="pricing-name">{name}</h3>
        <div className="pricing-price">
          <span className="price-currency">$</span>
          <span className="price-amount">{price}</span>
          <span className="price-period">/{period}</span>
        </div>
      </div>
      
      <ul className="pricing-features">
        {features.map((feature, idx) => (
          <li key={idx} className="feature-item">
            <span className="feature-check">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        className={`btn-modern ${highlighted ? 'btn-primary' : 'btn-secondary'} btn-full hover-lift`}
        onClick={onCtaClick}
      >
        {ctaLabel}
      </button>
    </div>
  );
};
