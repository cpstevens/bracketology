import { Link } from "remix";
import { HStack, Heading } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AppRoute } from "../routes";

interface NavRowProps {
  route: AppRoute;
}

export const NavRow: React.FC<NavRowProps> = ({ route }) => {
  return (
    <HStack spacing="4" padding="2" backgroundColor="whitesmoke">
      <FontAwesomeIcon size="sm" icon={route.icon} />
      <Link to={route.path}>
        <Heading size="lg">{route.displayName}</Heading>
      </Link>
    </HStack>
  );
};
