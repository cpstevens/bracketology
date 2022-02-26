import { RefObject, useState } from 'react';
import { Link } from 'remix';
import {
  Flex,
  Heading,
  Button,
  IconButton,
  ListIcon,
  Spacer,
} from '@chakra-ui/react';
import { FaList } from 'react-icons/fa';

interface AppHeaderProps {
  onSidebarOpenClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onSidebarOpenClick }) => {
  return (
    <Flex
      backgroundColor="InfoBackground"
      paddingX="8"
      paddingY="4"
      boxShadow="md"
    >
      <IconButton
        aria-label="toggle-sidebar"
        colorScheme="blackAlpha"
        onClick={onSidebarOpenClick}
        size="lg"
        mr="4"
        icon={<FaList />}
      />
      <Heading size="xl">
        <Link to="/">Bracketology</Link>
      </Heading>
      <Spacer />
      <Button colorScheme="blackAlpha" variant="solid">
        Login | Sign Up
      </Button>
    </Flex>
  );
};
