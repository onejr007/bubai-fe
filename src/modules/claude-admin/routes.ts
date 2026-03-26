import { Route } from '@core/Router';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoutesPage from './pages/AdminRoutesPage';
import AdminAdminsPage from './pages/AdminAdminsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPagesPage from './pages/AdminPagesPage';

export const adminRoutes: Route[] = [
  {
    path: '/adm-lgn',
    component: AdminLoginPage,
  },
  {
    path: '/admin/dashboard',
    component: AdminDashboardPage,
  },
  {
    path: '/admin/routes',
    component: AdminRoutesPage,
  },
  {
    path: '/admin/admins',
    component: AdminAdminsPage,
  },
  {
    path: '/admin/users',
    component: AdminUsersPage,
  },
  {
    path: '/admin/pages',
    component: AdminPagesPage,
  },
];
