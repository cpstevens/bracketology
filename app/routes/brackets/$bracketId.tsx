import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import {
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { supabaseClient } from '~/database/util/supabaseClient.server';
import { PageWrapper } from '~/Layouts/PageWrapper';
import { BracketEntry, BracketSummary } from '~/types/brackets';
import { CategoryBadge } from '~/components/CategoryBadge';

type LoaderData = {
  summary: BracketSummary;
  entries: BracketEntry[];
};

export const meta: MetaFunction = () => {
  return {
    title: 'Bracket Details',
    description: 'Bracket Entry Details',
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { bracketId } = params;

  if (!bracketId) {
    throw new Response('Bracket ID was empty', {
      status: 400,
    });
  }

  const { data: bracketSummary, error: summaryError } = await supabaseClient
    .from('summaries')
    .select(
      `
    id,
    name,
    description,
    author_id,
    created_at,
    category: category ( name ),
    status: status (name)
  `
    )
    .eq('id', params.bracketId);

  const { data: entryData, error: entryError } = await supabaseClient
    .from('entries')
    .select(
      `
    id,
    name,
    bracket_id,
    bracket_entry_id
  `
    )
    .eq('bracket_id', bracketId);

  if (summaryError) {
    console.error(summaryError);
    throw new Response(`Error fetching summary for bracket ${bracketId}`, {
      status: 500,
    });
  }

  return {
    summary: {
      id: bracketSummary![0].id,
      name: bracketSummary![0].name,
      description: bracketSummary![0].description,
      authorId: bracketSummary![0].author_id,
      category: bracketSummary![0].category.name,
      status: bracketSummary![0].status.name,
      createdAt: bracketSummary![0].created_at,
    },
    entries: entryData
      ? entryData.map((entry) => {
          return {
            entryId: entry.id,
            entryName: entry.name,
            bracketEntryId: entry.bracket_entry_id,
            bracketId: entry.bracket_id,
          };
        })
      : [],
  };
};

const BracketDetailsRoute: React.FC = () => {
  const { summary, entries } = useLoaderData<LoaderData>();

  return (
    <PageWrapper>
      <Heading as="h1">{summary.name}</Heading>
      <Text>By: {summary.authorId}</Text>
      <CategoryBadge category={summary.category} />
      <Text>Status: {summary.status}</Text>

      <Table>
        <Thead>
          <Tr>
            <Th>Entry Id</Th>
            <Th>Entry Name</Th>
            <Th>Bracket Entry Id</Th>
            <Th>Bracket</Th>
          </Tr>
        </Thead>
        <Tbody>
          {entries.map(({ entryId, entryName, bracketEntryId, bracketId }) => (
            <Tr key={`entry-${bracketEntryId}`}>
              <Td>{entryId}</Td>
              <Td>{entryName}</Td>
              <Td>{bracketEntryId}</Td>
              <Td>{bracketId}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </PageWrapper>
  );
};

export default BracketDetailsRoute;
