import { Route } from '@core/Router';
import HomePage from '@pages/HomePage';
import { ApiTestPage } from '@pages/ApiTestPage';
import UsersPage from '@pages/UsersPage';
import { MainLayout } from '@components/layouts/MainLayout';
import { exampleRoutes } from '@modules/claude-example/routes';
import { adminRoutes } from '@modules/claude-admin/routes';
import { hpCamRoutes } from '@modules/hp-cam/routes';

export const routes: Route[] = [
  {
    path: '/',
    component: HomePage,
    layout: MainLayout,
  },
  {
    path: '/api-test',
    component: ApiTestPage,
    layout: MainLayout,
  },
  {
    path: '/users',
    component: UsersPage,
    layout: MainLayout,
  },
  ...exampleRoutes,
  ...adminRoutes,
  ...hpCamRoutes,
];
