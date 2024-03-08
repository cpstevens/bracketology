import { Link } from '@remix-run/react';
import {
  Flex,
  Heading,
  Button,
  IconButton,
  Spacer,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FaList } from 'react-icons/fa';

interface AppHeaderProps {
  onSidebarOpenClick: () => void;
  isLoggedIn: boolean;
  username?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isLoggedIn,
  username,
  onSidebarOpenClick,
}) => {
  return (
    <Flex
      backgroundColor="cyan"
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
      <Link to="/">
        <Heading size="xl">Bracketology</Heading>
      </Link>
      <Spacer />

      {isLoggedIn ? (
        <HStack spacing="2">
          {username && <Text>{username}</Text>}
          <Link to="/logout">
            <Button>Sign Out</Button>
          </Link>
        </HStack>
      ) : (
        <Link to="/login">
          <Button colorScheme="blackAlpha" variant="solid">
            Login | Sign Up
          </Button>
        </Link>
      )}
    </Flex>
  );
};
