import { Outlet, Link, MetaFunction, useLoaderData } from 'remix';
import { Flex, Spacer, Button } from '@chakra-ui/react';
import { PageWrapper } from '~/Layouts/PageWrapper';
import { FaPencilAlt } from 'react-icons/fa';

export const meta: MetaFunction = () => {
  return {
    title: 'Bracketology - Brackets',
    description: 'Bracketology brackets',
  };
};

const BracketsRoute = () => {
  return (
    <PageWrapper>
      <Flex>
        <Outlet />
        <Spacer />
        <Link to="/brackets/create">
          <Button leftIcon={<FaPencilAlt />} colorScheme="blackAlpha">
            Create Bracket
          </Button>
        </Link>
      </Flex>
    </PageWrapper>
  );
};

export default BracketsRoute;
