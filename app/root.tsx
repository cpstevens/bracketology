import { ReactNode } from 'react';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';

import { ChakraProvider, extendBaseTheme } from '@chakra-ui/react';

import { Navigation } from '~/components/Navigation';
import { getSession } from '~/sessions.server';
import { UserContextType } from './types/auth';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const username = session.get('username');
  const isLoggedIn = session.has('accessToken');

  const data: UserContextType = {
    username: username,
    isLoggedIn,
  };
  return data;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Bracketology' }];
};

type DocumentProps = {
  children: ReactNode;
}

const Document = ({ children }: DocumentProps) => {
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
  return (
    <Document>
      <ChakraProvider>
        <Navigation username={username} isLoggedIn={isLoggedIn} />
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}
