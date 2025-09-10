// Entities Layer Exports
export * from './quiz';
export * from './user';

// History exports with explicit naming to avoid conflicts
export type { 
  QuizAttempt as HistoryAttempt, 
  QuizHistoryStats, 
  QuizHistoryFilter 
} from './history';
export { HistoryItem } from './history';
