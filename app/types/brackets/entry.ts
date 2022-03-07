export type BracketEntry = {
  entryId: number;
  bracketEntryId: number;
  entryName: string;
  bracketId: string;
};

export type BracketEntryUploadData = Pick<
  BracketEntry,
  'entryName' | 'bracketEntryId'
>;

export type BracketEntryDetails = {
  totalEntries: number;
  entries: BracketEntryUploadData[];
};
