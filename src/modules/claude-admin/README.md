# Claude Admin Module

## Overview
Complete admin panel with authentication, dashboard, and management features.

## Agent
- **Name**: Claude
- **Version**: 1.0.0
- **Created**: 2026-03-26

## Features

### 1. Admin Login (`/adm-lgn`)
- Secure login page
- Demo credentials provided
- Token-based authentication (localStorage)
- Redirect to dashboard on success

### 2. Dashboard (`/admin/dashboard`)
- Overview statistics
- Quick action buttons
- Navigation to all management pages
- Logout functionality

### 3. Route Management (`/admin/routes`)
- View all routes
- Add new routes dynamically
- Toggle route status (active/inactive)
- Delete routes
- Search functionality

### 4. Admin Management (`/admin/admins`)
- Manage admin users
- Add new admins
- Assign roles (Super Admin, Moderator, Editor)
- Toggle admin status
- Delete admins
- Search and filter

### 5. User Management (`/admin/users`)
- View all users
- Change user status (active/inactive/banned)
- Delete users
- Search users
- Filter by status
- Statistics summary

### 6. Page Management (`/admin/pages`)
- Manage page content
- Add new pages
- Toggle publish status
- Delete pages
- Search pages

## Routes

```typescript
/adm-lgn              → Admin Login
/admin/dashboard      → Dashboard
/admin/routes         → Route Management
/admin/admins         → Admin Management
/admin/users          → User Management
/admin/pages          → Page Management
```

## Demo Credentials

```
Username: admin
Password: admin123
```

## Authentication

Uses localStorage for demo purposes:
- `adminToken`: Authentication token
- `adminUser`: User information

In production, replace with proper JWT/session authentication.

## File Structure

```
claude-admin/
├── pages/
│   ├── AdminLoginPage.tsx
│   ├── AdminDashboardPage.tsx
│   ├── AdminRoutesPage.tsx
│   ├── AdminAdminsPage.tsx
│   ├── AdminUsersPage.tsx
│   └── AdminPagesPage.tsx
├── routes.ts
├── module.json
└── README.md
```

## Styling

All styles included in `FE/src/styles/global.css`:
- Login page styles
- Dashboard styles
- Data table styles
- Modal styles
- Form styles
- Button styles

## Usage

1. Navigate to `/adm-lgn`
2. Login with demo credentials
3. Access dashboard at `/admin/dashboard`
4. Navigate to management pages

## Security Notes

⚠️ **This is a demo implementation**

For production:
- Implement proper backend authentication
- Use JWT or session-based auth
- Add CSRF protection
- Implement role-based access control (RBAC)
- Add input validation
- Sanitize user inputs
- Use HTTPS
- Implement rate limiting

## Future Enhancements

- [ ] Backend API integration
- [ ] Real authentication system
- [ ] Role-based permissions
- [ ] Activity logs
- [ ] Export data functionality
- [ ] Bulk operations
- [ ] Advanced filtering
- [ ] Pagination
- [ ] File upload
- [ ] Rich text editor for pages

## Integration with Backend

When BE is ready, update:

1. Login: POST `/api/admin/login`
2. Routes: GET/POST/PUT/DELETE `/api/admin/routes`
3. Admins: GET/POST/PUT/DELETE `/api/admin/admins`
4. Users: GET/POST/PUT/DELETE `/api/admin/users`
5. Pages: GET/POST/PUT/DELETE `/api/admin/pages`

## Notes

- No layout wrapper (full-screen admin UI)
- Protected routes (check token)
- Responsive design
- Clean and modern UI
- Easy to extend
