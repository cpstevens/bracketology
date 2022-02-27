import {
  ActionFunction,
  MetaFunction,
  Form,
  Link,
  useTransition,
  useActionData,
} from 'remix';
import {
  Button,
  Divider,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Box,
} from '@chakra-ui/react';

import { PageWrapper } from '~/Layouts/PageWrapper';
import { SignUpRequest } from '~/types/auth';
import { supabaseClient } from '~/database/util/supabaseClient.server';

type RegisterActionData = {
  values: SignUpRequest;
  errors: Record<keyof SignUpRequest, string>;
};

export const meta: MetaFunction = () => {
  return {
    title: 'Bracketology - Sign Up',
    description: 'Bracketology Account creation page',
  };
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const { username, email, password, passwordConfirmation } =
    Object.fromEntries(body) as SignUpRequest;

  if (password !== passwordConfirmation) {
    return {
      errors: {
        passwordConfirmation: 'Passwords must match',
      },
      values: {
        username,
        email,
        password,
        passwordConfirmation,
      },
    };
  }

  try {
    const { user, session, error } = await supabaseClient.auth.signUp(
      {
        email,
        password,
      },
      {
        data: {
          username,
        },
      }
    );

    const useSession = supabaseClient.auth.session();
  } catch (error) {
    console.error('Error registering user', error);
  }
  return null;
};

const RegisterRoute = () => {
  const transition = useTransition();
  const actionData = useActionData<RegisterActionData>();

  return (
    <PageWrapper>
      <VStack>
        <Heading as="h1">Register</Heading>
        <Form method="post">
          <fieldset disabled={transition.state === 'submitting'}>
            <FormLabel>
              Username
              <Input
                type="text"
                name="username"
                placeholder="Username"
                defaultValue={actionData?.values.username}
                required
              />
            </FormLabel>
            <FormLabel>
              Email
              <Input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={actionData?.values.email}
                required
              />
            </FormLabel>
            <FormLabel>
              Password
              <Input
                type="password"
                name="password"
                placeholder="Password"
                defaultValue={actionData?.values.password}
                required
              />
            </FormLabel>
            <FormLabel>
              <Box>
                Confirm Password
                {actionData?.errors.passwordConfirmation && (
                  <Text color="red.400">
                    {actionData?.errors.passwordConfirmation}
                  </Text>
                )}
              </Box>

              <Input
                type="password"
                name="passwordConfirmation"
                placeholder="Confirm Password"
                defaultValue={actionData?.values.passwordConfirmation}
                required
              />
            </FormLabel>
            <Button
              isLoading={transition.state === 'submitting'}
              loadingText="Signing Up"
              width="100%"
              colorScheme="blackAlpha"
              type="submit"
            >
              Sign Up
            </Button>
          </fieldset>
        </Form>
        <Divider />
        <Text fontSize="2xl">Already have an account?</Text>
        <Link to="/login">
          <Button colorScheme="green">Login</Button>
        </Link>
      </VStack>
    </PageWrapper>
  );
};

export default RegisterRoute;
