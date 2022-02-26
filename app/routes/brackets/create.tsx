import { useEffect } from 'react';
import { ActionFunction, Form, MetaFunction, useFetcher } from 'remix';
import {
  Heading,
  VStack,
  Input,
  Textarea,
  Select,
  Button,
} from '@chakra-ui/react';

import { BracketCategoryLoaderData } from './categories';
import { FaPlusCircle } from 'react-icons/fa';

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  console.log(body);
  return {};
};

export const meta: MetaFunction = () => {
  return {
    title: 'Bracketology - Create Bracket',
    description: 'Create a bracket that other users can vote on',
  };
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
    <VStack>
      <Heading as="h1">Create New Bracket</Heading>
      <Form method="post">
        <Input placeholder="Bracket Name" name="name" />
        <Textarea
          placeholder="A brief description of the bracket"
          name="description"
        />
        <Select variant="outline" placeholder="Category" name="category">
          {categoryFetcher.type === 'done' &&
            categoryFetcher.data?.categories.map((category) => {
              return (
                <option
                  key={`bracket-category=${category.id}`}
                  value={category.id}
                >
                  {category.name}
                </option>
              );
            })}
        </Select>
        <Button
          leftIcon={<FaPlusCircle />}
          type="submit"
          colorScheme="blackAlpha"
        >
          Submit
        </Button>
      </Form>
    </VStack>
  );
};

export default CreateBracketRoute;
