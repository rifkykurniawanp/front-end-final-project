import { Lesson } from '@/types/course';
import { Quiz } from './quiz';

export const tea13: Lesson = {
  id: 'tea-13',
  slug: 'tea-brewing-assessment',
  title: 'Tea Brewing Assessment',
  description: 'Test your knowledge of tea brewing techniques',
  duration: '30 min',
  completed: false,
  type: 'quiz',
  quiz: Quiz,
  bookmarked: false,
  notes: ''
};