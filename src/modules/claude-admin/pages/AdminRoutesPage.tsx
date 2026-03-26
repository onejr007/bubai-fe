import React, { useState, useEffect } from 'react';
import { useNavigate } from '@core/Router';

interface RouteItem {
  id: number;
  path: string;
  component: string;
  module: string;
  status: 'active' | 'inactive';
}

const AdminRoutesPage: React.FC = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<RouteItem[]>([
    { id: 1, path: '/', component: 'HomePage', module: 'core', status: 'active' },
    { id: 2, path: '/example', component: 'ExampleListPage', module: 'claude-example', status: 'active' },
    { id: 3, path: '/example/detail/:id', component: 'ExampleDetailPage', module: 'claude-example', status: 'active' },
    { id: 4, path: '/adm-lgn', component: 'AdminLoginPage', module: 'claude-admin', status: 'active' },
    { id: 5, path: '/admin/dashboard', component: 'AdminDashboardPage', module: 'claude-admin', status: 'active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoute, setNewRoute] = useState({ path: '', component: '', module: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/adm-lgn');
  }, [navigate]);

  const filteredRoutes = routes.filter(route =>
    route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoute = () => {
    if (newRoute.path && newRoute.component && newRoute.module) {
      const route: RouteItem = {
        id: routes.length + 1,
        ...newRoute,
        status: 'active'
      };
      setRoutes([...routes, route]);
      setNewRoute({ path: '', component: '', module: '' });
      setShowAddModal(false);
    }
  };

  const handleToggleStatus = (id: number) => {
    setRoutes(routes.map(route =>
      route.id === id
        ? { ...route, status: route.status === 'active' ? 'inactive' : 'active' }
        : route
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(route => route.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>Route Management</h1>
      </div>

      <div className="page-actions">
        <input
          type="text"
          placeholder="Search routes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          + Add Route
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Path</th>
              <th>Component</th>
              <th>Module</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map(route => (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td><code>{route.path}</code></td>
                <td>{route.component}</td>
                <td><span className="badge">{route.module}</span></td>
                <td>
                  <span className={`status-badge ${route.status}`}>
                    {route.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(route.id)}
                    className="btn-sm"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDelete(route.id)}
                    className="btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Route</h2>
            <div className="form-group">
              <label>Path</label>
              <input
                type="text"
                value={newRoute.path}
                onChange={(e) => setNewRoute({ ...newRoute, path: e.target.value })}
                placeholder="/my-route"
              />
            </div>
            <div className="form-group">
              <label>Component</label>
              <input
                type="text"
                value={newRoute.component}
                onChange={(e) => setNewRoute({ ...newRoute, component: e.target.value })}
                placeholder="MyComponent"
              />
            </div>
            <div className="form-group">
              <label>Module</label>
              <input
                type="text"
                value={newRoute.module}
                onChange={(e) => setNewRoute({ ...newRoute, module: e.target.value })}
                placeholder="my-module"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleAddRoute} className="btn-primary">Add</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoutesPage;
