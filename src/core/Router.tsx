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
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [params, setParams] = useState<Record<string, string>>({});
  const [matchedRoute, setMatchedRoute] = useState<Route | null>(null);

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
    let foundRoute: Route | null = null;
    let foundParams: Record<string, string> = {};

    for (const route of routes) {
      const pattern = route.path.replace(/:\w+/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      const match = currentPath.match(regex);

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

    setMatchedRoute(foundRoute);
    setParams(foundParams);
  }, [currentPath, routes]);

  const Component = matchedRoute?.component || (() => <div>404 - Page Not Found</div>);
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
