import React, { useState, useEffect } from 'react';
import { useNavigate } from '@core/Router';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const AdminAdminsPage: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'Super Admin', status: 'active', lastLogin: '2026-03-26 10:30' },
    { id: 2, username: 'moderator', email: 'mod@example.com', role: 'Moderator', status: 'active', lastLogin: '2026-03-25 15:20' },
    { id: 3, username: 'editor', email: 'editor@example.com', role: 'Editor', status: 'inactive', lastLogin: '2026-03-20 09:15' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', role: 'Editor' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/adm-lgn');
  }, [navigate]);

  const filteredAdmins = admins.filter(admin =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAdmin = () => {
    if (newAdmin.username && newAdmin.email) {
      const admin: Admin = {
        id: admins.length + 1,
        ...newAdmin,
        status: 'active',
        lastLogin: 'Never'
      };
      setAdmins([...admins, admin]);
      setNewAdmin({ username: '', email: '', role: 'Editor' });
      setShowAddModal(false);
    }
  };

  const handleToggleStatus = (id: number) => {
    setAdmins(admins.map(admin =>
      admin.id === id
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(admin => admin.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>Admin Management</h1>
      </div>

      <div className="page-actions">
        <input
          type="text"
          placeholder="Search admins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          + Add Admin
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td><strong>{admin.username}</strong></td>
                <td>{admin.email}</td>
                <td><span className="badge">{admin.role}</span></td>
                <td>
                  <span className={`status-badge ${admin.status}`}>
                    {admin.status}
                  </span>
                </td>
                <td>{admin.lastLogin}</td>
                <td>
                  <button onClick={() => handleToggleStatus(admin.id)} className="btn-sm">
                    Toggle
                  </button>
                  <button onClick={() => handleDelete(admin.id)} className="btn-sm btn-danger">
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
            <h2>Add New Admin</h2>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                placeholder="username"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
              >
                <option value="Editor">Editor</option>
                <option value="Moderator">Moderator</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddAdmin} className="btn-primary">Add</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdminsPage;
