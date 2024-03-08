import { Heading, Select, Button, VStack, Flex } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, Form, useNavigation } from '@remix-run/react';

import { SeedSelect } from '~/components/SeedSelect';
import {
  SeedInsertData,
  setBracketSeeds,
} from '~/database/commands/setSeeds.server';
import { getBracketDetails } from '~/database/queries/brackets.server';
import { useSeedSelection } from '~/hooks/useSeedSelection';
import { PageWrapper } from '~/Layouts/PageWrapper';
import { commitSession, getSession, isSessionValid } from '~/sessions.server';
import { Bracket, BracketEntry } from '~/types/brackets';

type LoaderData = Bracket;

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { bracketId } = params;

  const session = await getSession(request.headers.get('Cookie'));
  if (!isSessionValid(session)) {
    session.flash('error', 'You must login to create brackets');
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

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

  return json<LoaderData>({
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
        return {
          entryId: entry.id,
          entryName: entry.name,
          bracketId: entry.bracket_id,
        };
      })
      : [],
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!isSessionValid(session)) {
    return json(
      {},
      {
        status: 401,
        statusText: 'Unauthorized',
      }
    );
  }

  const userId = session.get('userId');
  const body = await request.formData();

  const totalEntries = parseInt(body.get('total-entries')!.toString(), 10);
  const seedData: SeedInsertData[] = [];

  for (let i = 1; i <= totalEntries; ++i) {
    const seedValue = body.get(`seed-${i}`)!.toString();
    seedData.push({
      seedNumber: i,
      entryId: parseInt(seedValue, 10),
    });
  }

  console.log(body);

  return {};
};

export const meta: MetaFunction = () => {
  return [{
    title: 'Bracketology - Seed Bracket',
    description: 'Set seeds for a bracket',
  }];
};

const SeedBracketRoute: React.FC = () => {
  const data = useLoaderData<typeof loader>();
  const { state: transitionState } = useNavigation();
  const { selectedSeeds, unseededEntries, onSeedSelected, clearSeeds } =
    useSeedSelection(data.entries);

  return (
    <PageWrapper>
      <Heading as="h1">Set Bracket Seeds</Heading>
      <Button colorScheme="red" onClick={clearSeeds}>
        Clear Seeds
      </Button>
      <Form method="post">
        <fieldset disabled={transitionState === 'submitting'}>
          <input
            type="hidden"
            name="total-entries"
            value={data.entries.length}
          />
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            gap="2"
          >
            {Object.keys(selectedSeeds).map((seed) => {
              const seedNumber = parseInt(seed, 10);
              return (
                <SeedSelect
                  key={`seed-${seedNumber}-selected-${selectedSeeds[seedNumber]}`}
                  seedNumber={seedNumber}
                  availableEntries={unseededEntries}
                  onSelect={onSeedSelected}
                  selectedValue={selectedSeeds[seedNumber]}
                />
              );
            })}
            <Button type="submit">Set Seds</Button>
          </Flex>
        </fieldset>
      </Form>
    </PageWrapper>
  );
};

export default SeedBracketRoute;
