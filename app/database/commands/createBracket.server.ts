import {
  BracketEntryDetails,
  BracketEntryUploadData,
  BracketSummaryUploadData,
} from '~/types/brackets';
import { supabaseClient } from '../util/supabaseClient.server';

export const createBracket = async (
  summaryInsertData: BracketSummaryUploadData,
  entryValues: BracketEntryDetails
) => {
  const { data: summaryData, error: summaryError } = await createBracketSummary(
    summaryInsertData
  );

  if (summaryError) {
    throw new Response('Error Creating bracket', {
      status: 500,
    });
  }

  const entryInsertData = entryValues.entries.map((entry) => {
    return {
      name: entry.entryName,
      bracket_id: summaryData![0].id,
    };
  });

  const { data: entryData, error: entryError } = await createBracketEntries(
    entryInsertData
  );

  if (entryError) {
    throw new Response('Error Creating Bracket Entries', {
      status: 500,
    });
  }

  return {
    summaryData,
    entryData,
  };
};

const createBracketSummary = async (
  summaryInsertData: BracketSummaryUploadData
) => {
  return supabaseClient.from('summaries').insert([summaryInsertData]);
};

const createBracketEntries = async (
  entryInsertData: { name: string; bracket_id: any }[]
) => {
  return supabaseClient.from('entries').insert(entryInsertData);
};
