import { supabaseClient } from '../util/supabaseClient.server';

export const getBracketDetails = async (bracketId: string) => {
  const { data: bracketSummary, error: summaryError } = await supabaseClient
    .from('summaries')
    .select(
      `
    id,
    name,
    description,
    author_id,
    created_at,
    category: category ( name ),
    status: status (name)
  `
    )
    .eq('id', bracketId);

  const { data: entryData, error: entryError } = await supabaseClient
    .from('entries')
    .select(
      `
    id,
    name,
    bracket_id
  `
    )
    .eq('bracket_id', bracketId);

  return {
    bracketSummary,
    entryData,
    summaryError,
    entryError,
  };
};
