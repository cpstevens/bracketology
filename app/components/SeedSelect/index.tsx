import React from 'react';
import Select, { SingleValue } from 'react-select';
import { FormLabel, Text } from '@chakra-ui/react';

import { BracketEntry } from '~/types/brackets';

export interface SeedSelectProps {
  seedNumber: number;
  availableEntries: Record<number, BracketEntry>;
  onSelect: (seedNumber: number, entryId: number) => void;
  selectedValue: BracketEntry | undefined;
}

export const SeedSelect: React.FC<SeedSelectProps> = ({
  seedNumber,
  availableEntries,
  onSelect,
  selectedValue,
}) => {
  const onSelection = (newEntry: SingleValue<BracketEntry>) => {
    console.log(newEntry);
    onSelect(seedNumber, newEntry!.entryId);
  };

  const formatOptionLabel = (option: BracketEntry) => option.entryName;
  const formatOptionValue = (option: BracketEntry) => option.entryId.toString();

  return (
    <FormLabel>
      <Text>Seed {seedNumber}</Text>
      <Select
        defaultValue={selectedValue}
        value={selectedValue}
        name={`seed-${seedNumber}`}
        onChange={onSelection}
        getOptionLabel={formatOptionLabel}
        getOptionValue={formatOptionValue}
        options={Object.values(availableEntries)}
        placeholder={`${seedNumber} seed`}
      />
    </FormLabel>
  );
};
