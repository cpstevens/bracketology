import { json } from 'remix';
import { BracketCategory } from '~/types/brackets';

export type BracketCategoryLoaderData = {
  categories: BracketCategory[];
};

export const loader = async () => {
  //TODO - Replace this with a call to the DB

  const categories: Record<string, BracketCategory[]> = {
    categories: [
      {
        id: 1,
        name: 'sports',
      },
      {
        id: 2,
        name: 'music',
      },
      {
        id: 3,
        name: 'television',
      },
      {
        id: 4,
        name: 'movies',
      },
    ],
  };

  return json(categories);
};
