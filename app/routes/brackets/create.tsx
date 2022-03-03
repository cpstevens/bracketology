import { useEffect } from 'react';
import {
  ActionFunction,
  LoaderFunction,
  Form,
  MetaFunction,
  useFetcher,
  redirect,
  json,
  useCatch,
} from 'remix';
import {
  Heading,
  VStack,
  Input,
  Textarea,
  Select,
  Button,
  Center,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FaPlusCircle } from 'react-icons/fa';

import { BracketCategoryLoaderData } from './categories';
import { commitSession, getSession, isSessionValid } from '~/sessions.server';
import { PageWrapper } from '~/Layouts/PageWrapper';
import { validateBracketSummary } from '~/validation/brackets/summaries.server';
import { BracketStatusValue } from '~/types/brackets';
import { supabaseClient } from '~/database/util/supabaseClient.server';

export const action: ActionFunction = async ({ request }) => {
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
  const { errors, values } = validateBracketSummary(body);
  const insertData = {
    name: values.name,
    description: values.description,
    category: values.category,
    status: BracketStatusValue.Upcoming,
    author_id: userId,
  };

  const { data, error } = await supabaseClient
    .from('summaries')
    .insert([insertData]);

  if (error) {
    throw new Response('Error Creating bracket', {
      status: 500,
    });
  }

  console.log('Bracket Created!', data);

  return redirect('/brackets', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
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
  return {
    title: 'Bracketology - Create Bracket',
    description: 'Create a bracket that other users can vote on',
  };
};

export const CatchBoundary = () => {
  const { data, status } = useCatch();

  return (
    <Center>
      <Heading as="h1">Error - {status}</Heading>
      <Text>{data}</Text>
    </Center>
  );
};

const CreateBracketRoute = () => {
  const categoryFetcher = useFetcher<BracketCategoryLoaderData>();

  useEffect(() => {
    if (categoryFetcher.type !== 'init') {
      return;
    }

    categoryFetcher.load('/brackets/categories');
  }, [categoryFetcher]);

  return (
    <PageWrapper>
      <Center>
        <VStack spacing="4" width="100%">
          <Heading as="h1">Create New Bracket</Heading>
          <Form method="post">
            <VStack spacing="4" width="100%">
              <Input placeholder="Bracket Name" name="name" />
              <Textarea
                placeholder="A brief description of the bracket"
                name="description"
              />
              <Select variant="outline" placeholder="Category" name="category">
                {categoryFetcher.type === 'done' ? (
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
      </Center>
    </PageWrapper>
  );
};

export default CreateBracketRoute;
