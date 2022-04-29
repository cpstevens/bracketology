import { supabaseClient } from '../util/supabaseClient.server';

export type SeedInsertData = {
  entryId: number;
  seedNumber: number;
};

export const setBracketSeeds = async (seedData: SeedInsertData[]) => {
  const seedInserts = seedData.map((seed) => {
    return writeBracketSeed(seed);
  });

  await Promise.all(seedInserts);
};

export const writeBracketSeed = async ({
  entryId,
  seedNumber,
}: SeedInsertData) => {
  return supabaseClient
    .from('entries')
    .update({ seed: seedNumber })
    .match({ id: entryId });
};
