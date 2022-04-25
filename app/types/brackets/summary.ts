import { BracketEntry } from './entry';

export type BracketStatus = {
  id: number;
  name: string;
};

export const BracketStatusValue = {
  Upcoming: 1,
  Live: 2,
  Completed: 3,
} as const;

export type BracketCategory = {
  id: number;
  name: string;
};

export type BracketSummaryUploadData = Pick<
  BracketSummary,
  'name' | 'category' | 'description'
>;

export type BracketSummary = {
  id: string;
  name: string;
  description: string;
  status: string;
  authorId: string;
  category: string;
  createdAt: string;
};

export type Bracket = {
  summary: BracketSummary;
  entries: BracketEntry[];
};
