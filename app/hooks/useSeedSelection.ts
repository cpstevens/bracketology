import { useState, useEffect } from 'react';
import { BracketEntry } from '~/types/brackets';

export const useSeedSelection = (entries: BracketEntry[]) => {
  const [unseededEntries, setUnseededEntries] = useState<
    Record<number, BracketEntry>
  >({});
  const [selectedSeeds, setSelectedSeeds] = useState<
    Record<number, BracketEntry | undefined>
  >({});

  useEffect(() => {
    const entryData = entries.reduce((acc, cur) => {
      acc[cur.entryId] = cur;
      return acc;
    }, {} as Record<number, BracketEntry>);

    const seedObject = entries.reduce((acc, _, index) => {
      acc[index + 1] = undefined;
      return acc;
    }, {} as Record<number, BracketEntry | undefined>);

    setUnseededEntries(entryData);
    setSelectedSeeds(seedObject);
  }, []);

  const onSeedSelected = (seedNumber: number, entryId: number) => {
    const existingSeedEntry = selectedSeeds[seedNumber];

    setSelectedSeeds((previousSelectedSeeds) => {
      const newSelectedSeeds = { ...previousSelectedSeeds };
      newSelectedSeeds[seedNumber] = unseededEntries[entryId];

      return newSelectedSeeds;
    });

    setUnseededEntries((previousUnseededEntries) => {
      const newEntryOptions = { ...previousUnseededEntries };
      delete newEntryOptions[entryId];

      if (existingSeedEntry !== undefined) {
        newEntryOptions[existingSeedEntry.entryId] = existingSeedEntry;
      }

      return newEntryOptions;
    });
  };

  const clearSeeds = () => {
    console.log('clearing seeds');
    setUnseededEntries(
      entries.reduce((acc, cur) => {
        acc[cur.entryId] = cur;
        return acc;
      }, {} as Record<number, BracketEntry>)
    );

    setSelectedSeeds((previousSelectedSeeds) => {
      return Object.keys(previousSelectedSeeds).reduce((acc, _, index) => {
        acc[index + 1] = undefined;
        return acc;
      }, {} as Record<number, BracketEntry | undefined>);
    });
  };

  return {
    unseededEntries,
    selectedSeeds,
    onSeedSelected,
    clearSeeds,
  };
};
