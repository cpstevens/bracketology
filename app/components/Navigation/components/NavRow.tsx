import { Link } from '@remix-run/react';
import { Heading, Button } from '@chakra-ui/react';
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
      <Link to={route.path} style={{ width: '100%' }}>
        <Heading size="lg">{route.displayName}</Heading>
      </Link>
    </Button>
  );
};
