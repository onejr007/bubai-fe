import { Route } from '@core/Router';
import PairingPage from './pages/PairingPage';
import MobileCameraPage from './pages/MobileCameraPage';
import ViewerPage from './pages/ViewerPage';

export const hpCamRoutes: Route[] = [
  {
    path: '/hp-cam',
    component: PairingPage,
  },
  {
    path: '/hp-cam/mobile/:sessionId',
    component: MobileCameraPage,
  },
  {
    path: '/hp-cam/viewer/:sessionId',
    component: ViewerPage,
  }
];
