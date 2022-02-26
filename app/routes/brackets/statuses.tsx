import { BracketStatus } from '~/types/brackets';

export type BracketStatusLoaderData = {
  statuses: BracketStatus[];
};

export const loader = async () => {
  //TODO - Replace this with a call to the DB

  const statuses: BracketStatusLoaderData = {
    statuses: [
      {
        id: 1,
        name: 'upcoming',
      },
      {
        id: 2,
        name: 'live',
      },
      {
        id: 3,
        name: 'completed',
      },
    ],
  };

  return new Response(JSON.stringify(statuses), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
