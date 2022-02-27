import { Form, Link, redirect, useTransition } from 'remix';
import type { ActionFunction, MetaFunction } from 'remix';
import {
  VStack,
  Heading,
  FormLabel,
  Input,
  Divider,
  Button,
  Text,
} from '@chakra-ui/react';

import { PageWrapper } from '~/Layouts/PageWrapper';
import { LoginRequest } from '~/types/auth';
import { supabaseClient } from '~/database/util/supabaseClient.server';

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const { email, username, password } = Object.fromEntries(
    body
  ) as LoginRequest;

  try {
    const { user, session, error } = await supabaseClient.auth.signIn({
      email,
      password,
    });
    console.log(user);
    console.log(session);
    console.log(error);
    return redirect('/brackets');
  } catch (error) {
    console.error('An error occurred while logging in', error);
  }
  return null;
};

export const meta: MetaFunction = () => {
  return {
    title: 'Bracketology - Login',
    description: 'Login to Bracektology',
  };
};

const LoginRoute = () => {
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';

  return (
    <PageWrapper>
      <VStack>
        <Heading as="h1">Login</Heading>
        <Form method="post">
          <fieldset disabled={isSubmitting}>
            <FormLabel>
              Email
              <Input type="text" name="email" placeholder="Email" required />
            </FormLabel>
            <FormLabel>
              Password
              <Input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </FormLabel>
            <Button width="100%" colorScheme="blackAlpha" type="submit">
              Log In
            </Button>
          </fieldset>
        </Form>
        <Divider />
        <Text fontSize="2xl">New to Bracketology?</Text>
        <Link to="/register">
          <Button
            loadingText="Logging In"
            isLoading={isSubmitting}
            colorScheme="blue"
          >
            Sign Up
          </Button>
        </Link>
      </VStack>
    </PageWrapper>
  );
};

export default LoginRoute;
