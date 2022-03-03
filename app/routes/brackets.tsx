import { Outlet, MetaFunction } from 'remix';

import { PageWrapper } from '~/Layouts/PageWrapper';

export const meta: MetaFunction = () => {
  return {
    title: 'Bracketology - Brackets',
    description: 'Bracketology brackets',
  };
};

const BracketsRoute = () => {
  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
};

export default BracketsRoute;
