import React from 'react';
import { Stack, Heading } from '@chakra-ui/react';
import { Link } from '@remix-run/react';

import { routes } from '~/components/Navigation/routes';
import { NavRow } from './NavRow';

interface SideBarProps {
  onNavigation: () => void;
}

export const SideBar: React.FC<SideBarProps> = ({ onNavigation }) => {
  return (
    <Stack
      spacing="8"
      backgroundColor="cyan"
      height="100%"
      padding="8"
    >
      <Link onClick={onNavigation} to="/">
        <Heading size="xl">Bracketology</Heading>
      </Link>
      {routes.map((route, index) => {
        if (!route.displayInNav) {
          return null;
        }
        return (
          <NavRow onClick={onNavigation} key={`route-${index}`} route={route} />
        );
      })}
    </Stack>
  );
};
