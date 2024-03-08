import { useEffect, useState } from 'react';

import {
  Heading,
  VStack,
  Input,
  Textarea,
  Select,
  Button,
  Center,
  Container,
  Spinner,
  Text,
  RadioGroup,
  Radio,
  Stack,
  FormLabel,
  Divider,
  Box,
} from '@chakra-ui/react';
import { FaPlusCircle } from 'react-icons/fa';

import { BracketCategoryLoaderData } from './brackets.categories';
import { commitSession, getSession, isSessionValid } from '~/sessions.server';
import { PageWrapper } from '~/Layouts/PageWrapper';
import { validateBracketSummary } from '~/validation/brackets/summaries.server';
import {
  BracketEntryDetails,
  BracketStatusValue,
  BracketSummaryUploadData,
} from '~/types/brackets';
import { supabaseClient } from '~/database/util/supabaseClient.server';
import {
  BracketEntryErrors,
  validateBracketEntries,
} from '~/validation/brackets/entries.server';
import { createBracket } from '~/database/commands/createBracket.server';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import { Form, isRouteErrorResponse, useActionData, useFetcher, useRouteError } from '@remix-run/react';

type ActionData = {
  errors: {
    entries: BracketEntryErrors;
    summary: Record<keyof BracketSummaryUploadData, string>;
  };
  values: {
    entries: BracketEntryDetails;
    summary: BracketSummaryUploadData;
  };
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

  const {
    errors: summaryErrors,
    values: summaryValues,
    hasErrors: hasSummaryErrors,
  } = validateBracketSummary(body);

  const {
    errors: entryErrors,
    values: entryValues,
    hasErrors: hasEntryErrors,
  } = validateBracketEntries(body);

  if (hasSummaryErrors || hasEntryErrors) {
    return {
      values: {
        summary: {
          ...summaryValues,
        },
        entries: {
          ...entryValues,
        },
      },
      errors: {
        summary: {
          ...summaryErrors,
        },
        entries: {
          ...entryErrors,
        },
      },
    };
  }

  const summaryInsertData = {
    name: summaryValues.name,
    description: summaryValues.description,
    category: summaryValues.category,
    status: BracketStatusValue.Upcoming,
    author_id: userId,
  };

  const { summaryData, entryData } = await createBracket(
    summaryInsertData,
    entryValues
  );

  return redirect('/brackets', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!isSessionValid(session)) {
    session.flash('error', 'You must login to create brackets');
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return {};
};

export const meta: MetaFunction = () => {
  return [{
    title: 'Bracketology - Create Bracket',
    description: 'Create a bracket that other users can vote on',
  }];
};

export const CatchBoundary = () => {
  const caught = useRouteError();

  if (isRouteErrorResponse(caught)) {
    const { data, status } = caught;

    return (
      <Center>
        <Heading as="h1">Error - {status}</Heading>
        <Text>{data}</Text>
      </Center>
    );
  }

  return <div>oops</div>;
};

const CreateBracketRoute = () => {
  const categoryFetcher = useFetcher<BracketCategoryLoaderData>();
  const actionData = useActionData<ActionData>();

  const [totalEntries, setTotalEntries] = useState('4');
  const entries: number[] = Array.from({ length: parseInt(totalEntries, 10) });

  useEffect(() => {
    const isInit = categoryFetcher.state === 'idle' && categoryFetcher.data == null;
    if (!isInit) {
      return;
    }

    categoryFetcher.load('/brackets/categories');
  }, [categoryFetcher]);

  return (
    <PageWrapper>
      <Container>
        <VStack spacing="4" width="100%">
          <Heading as="h1">Create New Bracket</Heading>
          <Form method="post">
            <VStack spacing="4" width="100%">
              <VStack spacing="4" width="100%">
                <Heading as="h2">Summary</Heading>
                <FormLabel width="100%">
                  <Box>
                    <Text>Name</Text>
                    {actionData?.errors?.summary?.name && (
                      <Text color="red.400">
                        {actionData?.errors?.summary?.name}
                      </Text>
                    )}
                  </Box>
                  <Input placeholder="Bracket Name" name="name" />
                </FormLabel>
                <FormLabel width="100%">
                  <Text>Description</Text>
                  {actionData?.errors?.summary?.description && (
                    <Text color="red.400">
                      {actionData?.errors?.summary?.description}
                    </Text>
                  )}
                  <Textarea
                    placeholder="A brief description of the bracket"
                    name="description"
                  />
                </FormLabel>
                <FormLabel width="100%">
                  <Text>Category</Text>
                  {actionData?.errors?.summary?.category && (
                    <Text color="red.400">
                      {actionData?.errors?.summary?.category}
                    </Text>
                  )}
                  <Select
                    variant="outline"
                    placeholder="Category"
                    name="category"
                  >
                    {(categoryFetcher.state === 'idle' && categoryFetcher.data != null) ? (
                      categoryFetcher.data?.categories.map((category) => {
                        return (
                          <option
                            key={`bracket-category=${category.id}`}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        );
                      })
                    ) : (
                      <Spinner />
                    )}
                  </Select>
                </FormLabel>
              </VStack>
              <Divider />
              <VStack spacing="4" width="100%">
                <Heading as="h2">Entry Details</Heading>
                <RadioGroup
                  value={totalEntries}
                  onChange={setTotalEntries}
                  name="totalEntries"
                >
                  <Stack spacing="2" direction="row">
                    <Radio value="4">4</Radio>
                    <Radio value="8">8</Radio>
                    <Radio value="16">16</Radio>
                  </Stack>
                </RadioGroup>
                {entries.map((entry, index) => {
                  return (
                    <FormLabel>
                      <Box>
                        Entry {index}
                        {actionData?.errors?.entries.entryErrors[index] && (
                          <Text color="red.400">
                            {actionData?.errors?.entries.entryErrors[index]}
                          </Text>
                        )}
                      </Box>
                      <Input
                        key={`entry-${index}`}
                        placeholder={`Entry Name`}
                        name={`entry-${index}`}
                        required
                      />
                    </FormLabel>
                  );
                })}
              </VStack>
              <Button
                leftIcon={<FaPlusCircle />}
                type="submit"
                colorScheme="blackAlpha"
              >
                Submit
              </Button>
            </VStack>
          </Form>
        </VStack>
      </Container>
    </PageWrapper>
  );
};

export default CreateBracketRoute;