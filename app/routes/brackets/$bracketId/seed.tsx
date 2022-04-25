import { Heading, Select, Button, VStack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { LoaderFunction, MetaFunction, useLoaderData, Form } from 'remix';

import { SeedSelect } from '~/components/SeedSelect';
import { getBracketDetails } from '~/database/queries/brackets.server';
import { useSeedSelection } from '~/hooks/useSeedSelection';
import { PageWrapper } from '~/Layouts/PageWrapper';
import { Bracket, BracketEntry } from '~/types/brackets';

type LoaderData = Bracket;

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

export const meta: MetaFunction = () => {
  return {
    title: 'Bracketology - Seed Bracket',
    description: 'Set seeds for a bracket',
  };
};

const SeedBracketRoute: React.FC = () => {
  const data = useLoaderData<LoaderData>();
  const { selectedSeeds, unseededEntries, onSeedSelected, clearSeeds } =
    useSeedSelection(data.entries);

  useEffect(() => {
    console.log('Selected seeds', selectedSeeds);
    console.log('Unselected entries', unseededEntries);
  }, [selectedSeeds, unseededEntries]);

  return (
    <PageWrapper>
      <VStack width="100%" spacing="2">
        <Heading as="h1">Set Bracket Seeds</Heading>
        <Button colorScheme="red" onClick={clearSeeds}>
          Clear Seeds
        </Button>
        <Form method="post">
          {Object.keys(selectedSeeds).map((seed) => {
            const seedNumber = parseInt(seed, 10);
            return (
              <SeedSelect
                key={`seed-${seedNumber}`}
                seedNumber={seedNumber}
                availableEntries={unseededEntries}
                onSelect={onSeedSelected}
                selectedValue={selectedSeeds[seedNumber]}
              />
            );
          })}
        </Form>
      </VStack>
    </PageWrapper>
  );
};

export default SeedBracketRoute;
