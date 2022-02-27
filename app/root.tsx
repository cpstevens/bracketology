import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix';
import React, { useState } from 'react';
import type { MetaFunction } from 'remix';
import { ChakraProvider } from '@chakra-ui/provider';

import { theme } from './styles/theme';
import { Navigation } from '~/components/Navigation';

export const meta: MetaFunction = () => {
  return { title: 'Bracketology' };
};

const Document: React.FC = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebarClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Navigation />
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}
