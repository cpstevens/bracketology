import { Form, Link, useActionData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import {
  Button,
  Divider,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Box,
  Center,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react';

import { PageWrapper } from '~/Layouts/PageWrapper';
import { SignUpRequest } from '~/types/auth';
import { supabaseClient } from '~/database/util/supabaseClient.server';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { useNavigation } from '@remix-run/react';

type RegisterActionData = {
  values: SignUpRequest;
  validationErrors: Record<keyof SignUpRequest, string>;
  hasErrors: boolean;
  registrationError?: string;
};

export const meta: MetaFunction = () => {
  return [{
    title: 'Bracketology - Sign Up',
    description: 'Bracketology Account creation page',
  }];
};

const validateRequiredFields = (fields: SignUpRequest): RegisterActionData => {
  const { username, email, password, passwordConfirmation } = fields;
  const returnData: RegisterActionData = {
    values: { ...fields },
    hasErrors: false,
    validationErrors: {} as Record<keyof SignUpRequest, string>,
  };

  if (!username) {
    returnData.validationErrors['username'] = 'Username Required';
    returnData.hasErrors = true;
  }

  if (!email) {
    returnData.validationErrors['email'] = 'Email Required';
    returnData.hasErrors = true;
  }

  if (!passwordConfirmation) {
    returnData.validationErrors['passwordConfirmation'] =
      'Password Confirmation Required';
    returnData.hasErrors = true;
  }

  if (password !== passwordConfirmation) {
    returnData.validationErrors['passwordConfirmation'] =
      'Passwords Must Match';
    returnData.hasErrors = true;
  }

  return returnData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const values = Object.fromEntries(body) as SignUpRequest;

  const { username, email, password, passwordConfirmation } = values;
  const actionData = validateRequiredFields(values);
  if (actionData.hasErrors) {
    return actionData;
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

    if (error) {
      actionData.registrationError = error?.message;
      actionData.hasErrors = true;
    }
  } catch (error) {
    console.error('Error registering user', error);
  }
  return json<RegisterActionData>(actionData);
};

const RegisterRoute = () => {
  const transition = useNavigation();
  const actionData = useActionData<typeof action>();
  const hasRegistrationError = !!actionData?.registrationError;

  return (
    <PageWrapper>
      <VStack>
        <Heading as="h1">Register</Heading>
        {hasRegistrationError && (
          <Alert width="100%" variant="left-accent" status="error">
            <AlertIcon />
            <AlertTitle>There was an error registering your Account</AlertTitle>
            <AlertDescription>{actionData?.registrationError}</AlertDescription>
          </Alert>
        )}
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
                {actionData?.validationErrors?.passwordConfirmation && (
                  <Text color="red.400">
                    {actionData?.validationErrors?.passwordConfirmation}
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
