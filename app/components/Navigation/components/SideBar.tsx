import React from "react";
import { Stack, Heading } from "@chakra-ui/react";
import { Link } from "remix";

import { routes } from "~/components/Navigation/routes";
import { NavRow } from "./NavRow";

export const SideBar: React.FC = () => {
  return (
    <Stack spacing="8" backgroundColor="Background" height="100%" padding="8">
      <Link to="/">
        <Heading size="xl">Bracketology</Heading>
      </Link>
      {routes.map((route, index) => {
        if (!route.displayInNav) {
          return null;
        }
        return <NavRow key={`route-${index}`} route={route} />;
      })}
    </Stack>
  );
};
