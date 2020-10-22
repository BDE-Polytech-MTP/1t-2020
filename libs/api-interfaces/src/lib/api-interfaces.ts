export interface Challenge {
  uuid?: string;
  title: string;
  score: number;
  sam: number;
  clover: number;
  alex: number;
  category: string | null;
}

type Team = 'clover' | 'sam' | 'alex';