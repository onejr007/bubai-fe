import React, { useEffect, useState } from 'react';
import { useNavigate } from '@core/Router';
import { AdminLayout } from '@components/admin/AdminLayout';
import { Card } from '@components/admin/Card';

interface DashboardStats {
  totalRoutes: number;
  totalAdmins: number;
  totalUsers: number;
  totalPages: number;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats] = useState<DashboardStats>({
    totalRoutes: 12,
    totalAdmins: 3,
    totalUsers: 156,
    totalPages: 8,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/adm-lgn');
    }
  }, [navigate]);

  const statsCards = [
    { icon: '🛣️', label: 'Routes', value: stats.totalRoutes, path: '/admin/routes', color: '#667eea' },
    { icon: '👨‍💼', label: 'Admins', value: stats.totalAdmins, path: '/admin/admins', color: '#10b981' },
    { icon: '👥', label: 'Users', value: stats.totalUsers, path: '/admin/users', color: '#f59e0b' },
    { icon: '📄', label: 'Pages', value: stats.totalPages, path: '/admin/pages', color: '#ef4444' },
  ];

  return (
    <AdminLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening.</p>
        </div>

        <div className="stats-grid">
          {statsCards.map((stat, idx) => (
            <div 
              key={idx}
              className="stat-card"
              onClick={() => navigate(stat.path)}
              style={{ borderLeft: `4px solid ${stat.color}` }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <Card title="Quick Actions" icon="⚡">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary btn-full" onClick={() => navigate('/admin/routes')}>
                Manage Routes
              </button>
              <button className="btn btn-success btn-full" onClick={() => navigate('/admin/admins')}>
                Manage Admins
              </button>
              <button className="btn btn-secondary btn-full" onClick={() => navigate('/admin/users')}>
                Manage Users
              </button>
            </div>
          </Card>

          <Card title="Recent Activity" icon="📊">
            <div style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
              <p style={{ margin: '0.5rem 0' }}>• New user registered</p>
              <p style={{ margin: '0.5rem 0' }}>• Route updated: /admin/dashboard</p>
              <p style={{ margin: '0.5rem 0' }}>• Admin login: admin</p>
              <p style={{ margin: '0.5rem 0' }}>• Page published: About Us</p>
            </div>
          </Card>

          <Card title="System Status" icon="💚">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Server</span>
                <span className="badge badge-success">Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Database</span>
                <span className="badge badge-success">Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>API</span>
                <span className="badge badge-success">Healthy</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
