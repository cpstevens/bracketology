import React from 'react';
import { ActionFunction, Form, Link, redirect } from 'remix';
import { Button, Heading, HStack, VStack } from '@chakra-ui/react';

import { getSession, destroySession } from '~/sessions.server';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};

const LogoutRoute: React.FC = () => {
  return (
    <VStack spacing="4">
      <Heading as="h1">Are You Sure You Want To Sign Out?</Heading>
      <HStack spacing="2">
        <Link to="/brackets">
          <Button colorScheme="red">No</Button>
        </Link>
        <Form method="post">
          <Button type="submit" colorScheme="green">
            Yes
          </Button>
        </Form>
      </HStack>
    </VStack>
  );
};

export default LogoutRoute;
