import {
  Form,
  json,
  Link,
  redirect,
  useLoaderData,
  useTransition,
} from 'remix';
import type { ActionFunction, MetaFunction, LoaderFunction } from 'remix';
import {
  VStack,
  Heading,
  FormLabel,
  Input,
  Divider,
  Button,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';

import { PageWrapper } from '~/Layouts/PageWrapper';
import { LoginRequest } from '~/types/auth';
import { supabaseClient } from '~/database/util/supabaseClient.server';
import { getSession, commitSession } from '~/sessions.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('access_token')) {
    return redirect('/brackets');
  }

  const data = { error: session.get('error') };
  console.log(data);

  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const body = await request.formData();
  const { email, password } = Object.fromEntries(body) as LoginRequest;

  try {
    const {
      user,
      session: userSession,
      error,
    } = await supabaseClient.auth.signIn({
      email,
      password,
    });

    if (error) {
      session.flash('error', error?.message);

      return redirect('/login', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    }

    if (userSession === null || user === null) {
      return redirect('/login', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    }

    session.set('accessToken', userSession.access_token);
    session.set('userId', user?.id);
    session.set('username', user.user_metadata.username);
    return redirect('/brackets', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
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
  const { error } = useLoaderData();
  const isSubmitting = transition.state === 'submitting';

  return (
    <PageWrapper>
      <VStack>
        <Heading as="h1">Login</Heading>
        {error && (
          <Alert status="error" variant="solid">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
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
            <Button
              loadingText="Logging In"
              isLoading={isSubmitting}
              width="100%"
              colorScheme="blackAlpha"
              type="submit"
            >
              Log In
            </Button>
          </fieldset>
        </Form>
        <Divider />
        <Text fontSize="2xl">New to Bracketology?</Text>
        <Link to="/register">
          <Button colorScheme="blue">Sign Up</Button>
        </Link>
      </VStack>
    </PageWrapper>
  );
};

export default LoginRoute;
