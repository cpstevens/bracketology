import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import {
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaPencilAlt } from 'react-icons/fa';

import { supabaseClient } from '~/database/util/supabaseClient.server';
import { BracketSummary } from '~/types/brackets';
import { SummaryCard } from '~/components/SummaryCard';

type LoaderData = {
  brackets: BracketSummary[];
};

export const loader: LoaderFunction = async () => {
  const { data, error } = await supabaseClient.from('summaries').select(`
    id,
    name,
    description,
    author_id,
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

  return {
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
  };
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
  const { brackets } = useLoaderData<LoaderData>();
  return (
    <>
      <Flex>
        <Heading as="h1">Brackets</Heading>
        <Spacer />
        <Link to="/brackets/create">
          <Button leftIcon={<FaPencilAlt />} colorScheme="blackAlpha">
            Create Bracket
          </Button>
        </Link>
      </Flex>

      <Wrap>
        {brackets.map(({ id, name, authorId, description, category }) => {
          return (
            <WrapItem key={id}>
              <SummaryCard
                id={id}
                name={name}
                author={authorId}
                category={category}
                description={description}
              />
            </WrapItem>
          );
        })}
      </Wrap>
    </>
  );
};

export default BracketsIndexRoute;
