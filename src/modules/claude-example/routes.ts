import { Route } from '@core/Router';
import { MainLayout } from '@components/layouts/MainLayout';
import ExampleListPage from './pages/ExampleListPage';
import ExampleDetailPage from './pages/ExampleDetailPage';

export const exampleRoutes: Route[] = [
  {
    path: '/example',
    component: ExampleListPage,
    layout: MainLayout,
  },
  {
    path: '/example/detail/:id',
    component: ExampleDetailPage,
    layout: MainLayout,
  },
];
