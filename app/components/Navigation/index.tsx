import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import React from "react";

import { useDisclosure } from "~/hooks/useDisclosure";
import { AppHeader } from "./components/AppHeader";
import { SideBar } from "./components/SideBar";

export const Navigation: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AppHeader onSidebarOpenClick={onOpen} />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <SideBar />
        </DrawerContent>
      </Drawer>
    </>
  );
};
