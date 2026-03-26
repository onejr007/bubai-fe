import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <header className="header">
        <nav>AI Agent Framework</nav>
      </header>
      <main className="content">{children}</main>
      <footer className="footer">Built for AI Agents</footer>
    </div>
  );
};
