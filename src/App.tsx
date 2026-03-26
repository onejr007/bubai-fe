import React from 'react';
import { Router } from '@core/Router';
import { routes } from './routes';

const App: React.FC = () => {
  return <Router routes={routes} />;
};

export default App;
