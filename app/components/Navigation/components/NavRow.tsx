import { Link } from 'remix';
import { HStack, Heading, Button } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppRoute } from '../routes';

interface NavRowProps {
  route: AppRoute;
  onClick: () => void;
}

export const NavRow: React.FC<NavRowProps> = ({ route, onClick }) => {
  return (
    <Button
      leftIcon={<FontAwesomeIcon size="sm" icon={route.icon} />}
      colorScheme="blackAlpha"
      padding="2"
      onClick={onClick}
    >
      <Heading size="lg">
        <Link to={route.path}>{route.displayName}</Link>
      </Heading>
    </Button>
  );
};
