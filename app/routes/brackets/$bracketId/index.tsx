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

import { PageWrapper } from '~/Layouts/PageWrapper';
import { Bracket } from '~/types/brackets';
import { CategoryBadge } from '~/components/CategoryBadge';
import { getBracketDetails } from '~/database/queries/brackets.server';

type LoaderData = Bracket;

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

  const { bracketSummary, summaryError, entryData, entryError } =
    await getBracketDetails(bracketId);

  if (summaryError) {
    console.error(summaryError);
    throw new Response(`Error fetching summary for bracket ${bracketId}`, {
      status: 500,
    });
  }

  if (entryError) {
    console.error(entryError);
    throw new Response(`Error fetching entries for bracket ${bracketId}`, {
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
          {entries.map(({ entryId, entryName, bracketId }) => (
            <Tr key={`entry-${entryId}`}>
              <Td>{entryId}</Td>
              <Td>{entryName}</Td>
              <Td>{bracketId}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </PageWrapper>
  );
};

export default BracketDetailsRoute;
