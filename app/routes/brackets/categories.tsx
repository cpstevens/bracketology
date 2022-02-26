import { json } from 'remix';
import { supabaseClient } from '~/database/util/supabaseClient.server';
import { BracketCategory } from '~/types/brackets';

export type BracketCategoryLoaderData = {
  categories: BracketCategory[];
};

export const loader = async () => {
  //TODO - Replace this with a call to the DB
  const categories = await supabaseClient.from('categories').select();
  return json({ categories: categories.data as BracketCategory[] });
};
