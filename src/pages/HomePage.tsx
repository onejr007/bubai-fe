import React from 'react';
import { useNavigate } from '@core/Router';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>AI Agent Framework</h1>
      <p>Welcome to the collaborative AI Agent development framework</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Demo Modules</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/users')} style={{ background: '#3b82f6' }}>
            User Management (Couchbase)
          </button>
          <button onClick={() => navigate('/example')}>
            View Example Module
          </button>
          <button onClick={() => navigate('/adm-lgn')} style={{ background: '#667eea' }}>
            Admin Panel
          </button>
          <button onClick={() => navigate('/hp-cam')} style={{ background: '#10b981' }}>
            HP Camera Pairing
          </button>
        </div>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #3b82f6' }}>
          <p><strong>🚀 Backend API:</strong></p>
          <p>Production: <a href="https://bub-ai-be.web.app" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>https://bub-ai-be.web.app</a></p>
          <p>Swagger Docs: <a href="https://bub-ai-be.web.app/api-docs" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>https://bub-ai-be.web.app/api-docs</a></p>
          <p>Database: Couchbase Cloud</p>
        </div>
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
          <p><strong>Admin Demo Credentials:</strong></p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
