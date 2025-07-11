import { Lesson } from '@/types/course';

export const tea1: Lesson = {
  id: 'tea-1',
  slug: 'introduction-to-tea',
  title: 'Introduction to Tea',
  description: 'Learn about the history and cultural significance of tea around the world',
  duration: '15 min',
  completed: true,
  type: 'video',
  videoUrl: 'https://example.com/tea-intro',
  content: 'Tea has been consumed for over 5,000 years...',
  bookmarked: false,
  notes: '',
  completedAt: new Date('2024-01-15')
};