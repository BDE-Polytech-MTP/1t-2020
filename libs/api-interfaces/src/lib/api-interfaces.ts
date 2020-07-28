export interface Challenge {
  uuid?: string;
  title: string;
  score: number;
  sam: boolean;
  clover: boolean;
  alex: boolean;
}

type Team = 'clover' | 'sam' | 'alex';