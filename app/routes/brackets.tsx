import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { PageWrapper } from '~/Layouts/PageWrapper';

export const meta: MetaFunction = () => {
  return [{
    title: 'Bracketology - Brackets',
    description: 'Bracketology brackets',
  }];
};

const BracketsRoute = () => {
  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  );
};

export default BracketsRoute;
