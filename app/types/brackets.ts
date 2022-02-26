export type BracketStatus = {
  id: number;
  name: string;
};

export type BracketCategory = {
  id: number;
  name: string;
};

export type BracketSummary = {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  createdAt: string;
};
