import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router';

import { type ReactNode } from 'react';

export const links = () => [];

export function ErrorBoundary() {
  const error = useRouteError();
  console.error('Root error boundary:', error);
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Error - Strategic Chess Game</title>
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fefce8 0%, #fed7aa 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            maxWidth: '400px',
            width: '100%',
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#374151', marginBottom: '16px'}}>
              Something went wrong
            </h2>
            <p style={{color: '#6b7280', marginBottom: '24px'}}>
              An error occurred while loading the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#d97706',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Strategic Chess Game</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}