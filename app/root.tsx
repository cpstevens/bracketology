import React from 'react';
import { MetaFunction, LoaderFunction, useLoaderData } from 'remix';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix';
import { ChakraProvider } from '@chakra-ui/provider';

import { theme } from './styles/theme';
import { Navigation } from '~/components/Navigation';
import { getSession } from '~/sessions';
import { UserContextType } from './types/auth';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const username = session.get('username');
  console.log(username);
  const isLoggedIn = session.has('accessToken');
  const data: UserContextType = {
    username: username,
    isLoggedIn,
  };
  return data;
};

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
  const { username, isLoggedIn } = useLoaderData<UserContextType>();
  console.log(username);
  console.log(isLoggedIn);
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Navigation username={username} isLoggedIn={isLoggedIn} />
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}
