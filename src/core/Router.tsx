import React, { useState, useEffect, createContext, useContext } from 'react';

export interface Route {
  path: string;
  component: React.ComponentType;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | null>(null);

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within Router');
  return context;
};

export const useNavigate = () => {
  const { navigate } = useRouter();
  return navigate;
};

export const useParams = () => {
  const { params } = useRouter();
  return params;
};

interface RouterProps {
  routes: Route[];
}

export const Router: React.FC<RouterProps> = ({ routes }) => {
  const calculateMatch = (path: string) => {
    let foundRoute: Route | null = null;
    let foundParams: Record<string, string> = {};

    for (const route of routes) {
      // Allow optional trailing slash
      // Replace :params with capture groups, then handle trailing slash
      const pattern = route.path.replace(/:\w+/g, '([^/]+)').replace(/\/$/, '') + '/?';
      const regex = new RegExp(`^${pattern}$`);
      const match = path.match(regex);

      if (match) {
        const paramNames = (route.path.match(/:\w+/g) || []).map(p => p.slice(1));
        const paramValues = match.slice(1);
        foundParams = Object.fromEntries(
          paramNames.map((name, i) => [name, paramValues[i]])
        );
        foundRoute = route;
        break;
      }
    }
    return { foundRoute, foundParams };
  };

  const initialMatch = calculateMatch(window.location.pathname);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [params, setParams] = useState<Record<string, string>>(initialMatch.foundParams);
  const [matchedRoute, setMatchedRoute] = useState<Route | null>(initialMatch.foundRoute);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const { foundRoute, foundParams } = calculateMatch(currentPath);
    setMatchedRoute(foundRoute);
    setParams(foundParams);
  }, [currentPath, routes]);

  const Component = matchedRoute?.component || (() => (
    <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem', color: '#1e293b' }}>404</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Page Not Found: {currentPath}</p>
      <button 
        onClick={() => navigate('/')}
        style={{ padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Go Home
      </button>
    </div>
  ));
  const Layout = matchedRoute?.layout;

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {Layout ? (
        <Layout>
          <Component />
        </Layout>
      ) : (
        <Component />
      )}
    </RouterContext.Provider>
  );
};
