import { Lesson } from '@/types/course';

export const tea2: Lesson = {
  id: 'tea-2',
  slug: 'tea-processing-methods',
  title: 'Tea Processing Methods',
  description: 'Understanding how tea leaves are processed to create different types',
  duration: '20 min',
  completed: true,
  type: 'video',
  videoUrl: 'https://example.com/tea-processing',
  content: 'The processing of tea leaves determines the final flavor profile...',
  bookmarked: true,
  notes: 'Remember: oxidation is key to flavor development',
  completedAt: new Date('2024-01-16')
};