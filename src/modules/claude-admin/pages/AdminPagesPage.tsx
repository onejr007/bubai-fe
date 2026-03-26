import React, { useState, useEffect } from 'react';
import { useNavigate } from '@core/Router';

interface PageContent {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  lastModified: string;
}

const AdminPagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageContent[]>([
    { id: 1, title: 'Home Page', slug: '/', status: 'published', lastModified: '2026-03-26' },
    { id: 2, title: 'About Us', slug: '/about', status: 'published', lastModified: '2026-03-25' },
    { id: 3, title: 'Contact', slug: '/contact', status: 'draft', lastModified: '2026-03-24' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/adm-lgn');
  }, [navigate]);

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPage = () => {
    if (newPage.title && newPage.slug) {
      const page: PageContent = {
        id: pages.length + 1,
        ...newPage,
        status: 'draft',
        lastModified: new Date().toISOString().split('T')[0]
      };
      setPages([...pages, page]);
      setNewPage({ title: '', slug: '' });
      setShowAddModal(false);
    }
  };

  const handleToggleStatus = (id: number) => {
    setPages(pages.map(page =>
      page.id === id
        ? { ...page, status: page.status === 'published' ? 'draft' : 'published' }
        : page
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this page?')) {
      setPages(pages.filter(page => page.id !== id));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/dashboard')} className="btn-back">
          ← Back
        </button>
        <h1>Page Management</h1>
      </div>

      <div className="page-actions">
        <input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          + Add Page
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPages.map(page => (
              <tr key={page.id}>
                <td>{page.id}</td>
                <td><strong>{page.title}</strong></td>
                <td><code>{page.slug}</code></td>
                <td>
                  <span className={`status-badge ${page.status}`}>
                    {page.status}
                  </span>
                </td>
                <td>{page.lastModified}</td>
                <td>
                  <button onClick={() => handleToggleStatus(page.id)} className="btn-sm">
                    Toggle
                  </button>
                  <button onClick={() => handleDelete(page.id)} className="btn-sm btn-danger">
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
            <h2>Add New Page</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newPage.title}
                onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                placeholder="Page Title"
              />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input
                type="text"
                value={newPage.slug}
                onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                placeholder="/page-slug"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleAddPage} className="btn-primary">Add</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPagesPage;
