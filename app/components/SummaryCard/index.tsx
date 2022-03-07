import React from 'react';
import { Container, Heading, Text, Box, VStack } from '@chakra-ui/react';
import { CategoryBadge } from '../CategoryBadge';
import { Link } from 'remix';

export interface SummaryCardProps {
  id: string;
  name: string;
  author: string;
  category: string;
  description: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  id,
  name,
  author,
  category,
  description,
}) => {
  return (
    <Container>
      <Box
        maxWidth="400"
        border="2px"
        borderRadius="lg"
        boxShadow="lg"
        padding="4"
      >
        <VStack spacing="2">
          <Link to={`/brackets/${id}`}>
            <Heading size="lg" as="h2">
              {name}
            </Heading>
          </Link>
          <Text>{author}</Text>
          <CategoryBadge category={category} />
          <Text>{description}</Text>
        </VStack>
      </Box>
    </Container>
  );
};
