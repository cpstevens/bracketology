import { LoaderFunction, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react'

import {
  Button,
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
import { BracketEntry, BracketSummary } from '~/types/brackets';
import { CategoryBadge } from '~/components/CategoryBadge';
import { getBracketDetails } from '~/database/queries/brackets.server';
import { getSession } from '~/sessions.server';

type LoaderData = {
  summary: BracketSummary;
  entries: BracketEntry[];
  isCreator: boolean;
};

export const meta: MetaFunction = () => {
  return [{
    title: 'Bracket Details',
    description: 'Bracket Entry Details',
  }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { bracketId } = params;

  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');
  console.log(userId);

  if (!bracketId) {
    throw new Response('Bracket ID was empty', {
      status: 400,
    });
  }

  const { bracketSummary, summaryError, entryData, entryError } =
    await getBracketDetails(bracketId);

  const isCreator = userId === bracketSummary![0].author_id;
  console.log(bracketSummary![0].author_id);
  console.log(isCreator);

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

  return json<LoaderData>({
    isCreator,
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
      ? entryData.map((entry: { id: any; name: any; bracket_id: any; }) => {
        console.log(entry);
        return {
          entryId: entry.id,
          entryName: entry.name,
          bracketId: entry.bracket_id,
        };
      })
      : [],
  });
};

const BracketDetailsRoute: React.FC = () => {
  const { isCreator, summary, entries } = useLoaderData<typeof loader>();

  return (
    <PageWrapper>
      <Heading as="h1">{summary.name}</Heading>
      <Text>By: {summary.authorId}</Text>
      <CategoryBadge category={summary.category} />
      <Text>Status: {summary.status}</Text>
      {isCreator && (
        <Link to={`/brackets/${summary.id}/seed`}>
          <Button colorScheme="blackAlpha">Set Seeds</Button>
        </Link>
      )}

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
