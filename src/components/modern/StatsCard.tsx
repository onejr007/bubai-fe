import React from 'react';

interface StatsCardProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  value,
  label,
  trend,
  color = 'var(--primary)',
}) => {
  return (
    <div className="stats-card-modern glass hover-lift">
      <div className="stats-header">
        <div className="stats-icon" style={{ background: color }}>
          {icon}
        </div>
        {trend && (
          <div className={`stats-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div className="stats-body">
        <div className="stats-value">{value}</div>
        <div className="stats-label">{label}</div>
      </div>
      
      <div className="stats-sparkline">
        <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path
            d="M0,30 L20,25 L40,28 L60,20 L80,22 L100,15"
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
};
