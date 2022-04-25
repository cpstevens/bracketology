export type BracketEntry = {
  entryId: number;
  entryName: string;
  bracketId: string;
};

export type BracketEntryUploadData = Pick<BracketEntry, 'entryName'>;

export type BracketEntryDetails = {
  totalEntries: number;
  entries: BracketEntryUploadData[];
};
