import React, { useState, useEffect } from 'react';
import { useNavigate, useRouter } from '@core/Router';

interface NavItem {
  label: string;
  path: string;
}

interface NavbarProps {
  logo?: string;
  items: NavItem[];
  ctaButton?: {
    label: string;
    onClick: () => void;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ logo, items, ctaButton }) => {
  const navigate = useNavigate();
  const { currentPath } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar-modern ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          {logo || <span className="text-gradient">Logo</span>}
        </div>

        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {items.map((item) => (
            <button
              key={item.path}
              className={`navbar-item ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          {ctaButton && (
            <button
              className="btn-modern btn-primary hover-lift"
              onClick={ctaButton.onClick}
            >
              {ctaButton.label}
            </button>
          )}
          
          <button
            className="navbar-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};
