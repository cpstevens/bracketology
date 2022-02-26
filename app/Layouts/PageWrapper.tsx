import React from "react";
import { Box } from "@chakra-ui/react";

export const PageWrapper: React.FC = ({ children }) => {
  return (
    <Box paddingX="8" paddingY="4">
      {children}
    </Box>
  );
};
