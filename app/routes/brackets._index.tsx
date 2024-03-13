import { Link, isRouteErrorResponse, json, useLoaderData, useRouteError } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import {
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Text,
  VStack,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FaPencilAlt } from 'react-icons/fa';

import { supabaseClient } from '~/database/util/supabaseClient.server';
import { BracketSummary } from '~/types/brackets';
import { SummaryCard } from '~/components/SummaryCard';

type LoaderData = {
  brackets: BracketSummary[];
};

export const loader = async () => {
  const { data, error } = await supabaseClient.from('summaries').select(`
    id,
    name,
    description,
    created_at,
    category: category ( name ),
    status: status (name)
  `);

  if (error) {
    console.error(error);
    throw new Response('Error fetching brackets', {
      status: 500,
    });
  }

  return json<LoaderData>({
    brackets: data?.map((entry: { id: any; name: any; description: any; author_id: any; category: { name: any; }; status: { name: any; }; created_at: any; }) => {
      const bracket: BracketSummary = {
        id: entry.id,
        name: entry.name,
        description: entry.description,
        authorId: entry.author_id,
        category: entry.category.name,
        status: entry.status.name,
        createdAt: entry.created_at,
      };
      return bracket;
    }),
  });
};

export const ErrorBoundary = () => {
  const caught = useRouteError();

  if (isRouteErrorResponse(caught)) {
    return (
      <Center>
        <Heading as="h1">Error - {caught.status}</Heading>
        <Text>{caught.data}</Text>
      </Center>
    );
  }

  return <div>fuck</div>
};

const BracketsIndexRoute = () => {
  const { brackets } = useLoaderData<typeof loader>();
  return (
    <VStack gap="4" align="start">
      <Flex flexDirection="row" justifyContent="space-between" width="100%">
        <Heading as="h1">Brackets</Heading>
        <Spacer />
        <Link to="/brackets/create">
          <Button leftIcon={<FaPencilAlt />} colorScheme="blackAlpha">
            Create Bracket
          </Button>
        </Link>
      </Flex>

      <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']} gap={6}>
        {brackets.map(({ id, name, description, category }) => {
          return (
            <GridItem key={id}>
              <SummaryCard
                id={id}
                name={name}
                category={category}
                description={description}
              />
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
};

export default BracketsIndexRoute;
