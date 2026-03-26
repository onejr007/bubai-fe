import React, { useState, useEffect } from 'react';
import { useNavigate } from '@core/Router';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'banned';
  registered: string;
}

const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', registered: '2026-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', registered: '2026-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', registered: '2026-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'banned', registered: '2026-01-05' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/adm-lgn');
  }, [navigate]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleChangeStatus = (id: number, newStatus: 'active' | 'inactive' | 'banned') => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>User Management</h1>
      </div>

      <div className="page-actions">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <span>Total: {users.length}</span>
        </div>
        <div className="stat-item">
          <span>Active: {users.filter(u => u.status === 'active').length}</span>
        </div>
        <div className="stat-item">
          <span>Inactive: {users.filter(u => u.status === 'inactive').length}</span>
        </div>
        <div className="stat-item">
          <span>Banned: {users.filter(u => u.status === 'banned').length}</span>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.status}
                    onChange={(e) => handleChangeStatus(user.id, e.target.value as any)}
                    className={`status-select ${user.status}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </td>
                <td>{user.registered}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)} className="btn-sm btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
