import { Outlet, Link, MetaFunction } from 'remix';
import { Heading, Flex, Spacer, Button } from '@chakra-ui/react';
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
        <Button leftIcon={<FaPencilAlt />} colorScheme="blackAlpha">
          <Link to="/brackets/create">Create Bracket</Link>
        </Button>
      </Flex>
    </PageWrapper>
  );
};

export default BracketsRoute;
