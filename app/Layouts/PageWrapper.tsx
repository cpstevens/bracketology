import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

type PageWrapperProps = {
  children: ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <Box paddingX="8" paddingY="4">
      {children}
    </Box>
  );
};
