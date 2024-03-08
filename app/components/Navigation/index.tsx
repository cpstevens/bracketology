import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import React from 'react';

import { useDisclosure } from '~/hooks/useDisclosure';
import { AppHeader } from './components/AppHeader';
import { SideBar } from './components/SideBar';

interface NavigationProps {
  username?: string;
  isLoggedIn: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  username,
  isLoggedIn,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AppHeader
        username={username}
        isLoggedIn={isLoggedIn}
        onSidebarOpenClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <SideBar onNavigation={onClose} />
        </DrawerContent>
      </Drawer>
    </>
  );
};
