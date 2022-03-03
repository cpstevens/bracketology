import { Link, useCatch, LoaderFunction, useLoaderData } from 'remix';
import {
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FaPencilAlt } from 'react-icons/fa';

import { supabaseClient } from '~/database/util/supabaseClient.server';
import { BracketSummary } from '~/types/brackets';

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
    brackets: data?.map((entry) => {
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

export const CatchBoundary = () => {
  const caught = useCatch();

  return (
    <Center>
      <Heading as="h1">Error - {caught.status}</Heading>
      <Text>{caught.data}</Text>
    </Center>
  );
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

      <Table>
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Author Id</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {brackets.map((bracket) => {
            return (
              <Tr key={bracket.id}>
                <Th>{bracket.id}</Th>
                <Th>{bracket.name}</Th>
                <Th>{bracket.description}</Th>
                <Th>{bracket.category}</Th>
                <Th>{bracket.status}</Th>
                <Th>{bracket.authorId}</Th>
                <Th>{bracket.createdAt}</Th>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};

export default BracketsIndexRoute;
