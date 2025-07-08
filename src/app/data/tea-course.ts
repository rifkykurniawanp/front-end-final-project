import { Course, Module, Lesson } from '@/types/course';

const teaLessons: { [moduleId: string]: Lesson[] } = {
  'tea-basics': [
    {
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
    },
    {
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
    },
    {
      id: 'tea-3',
      slug: 'green-vs-black-tea',
      title: 'Green Tea vs Black Tea',
      description: 'Compare and contrast the characteristics of green and black teas',
      duration: '25 min',
      completed: false,
      type: 'reading',
      content: 'Green tea undergoes minimal oxidation while black tea is fully oxidized...',
      bookmarked: false,
      notes: ''
    },
    {
      id: 'tea-4',
      slug: 'tea-tasting-basics',
      title: 'Tea Tasting Basics',
      description: 'Practice identifying different tea characteristics through tasting',
      duration: '30 min',
      completed: false,
      type: 'practice',
      content: 'Follow these steps to properly taste and evaluate tea...',
      bookmarked: false,
      notes: ''
    }
  ],
  'tea-varieties': [
    {
      id: 'tea-5',
      slug: 'chinese-tea-traditions',
      title: 'Chinese Tea Traditions',
      description: 'Explore the rich history and varieties of Chinese tea culture',
      duration: '30 min',
      completed: false,
      type: 'video',
      videoUrl: 'https://example.com/chinese-tea',
      content: 'China is the birthplace of tea with diverse regional varieties...',
      bookmarked: false,
      notes: ''
    },
    {
      id: 'tea-6',
      slug: 'japanese-tea-ceremony',
      title: 'Japanese Tea Ceremony',
      description: 'Learn about the philosophical and cultural aspects of Japanese tea ceremony',
      duration: '25 min',
      completed: false,
      type: 'video',
      videoUrl: 'https://example.com/japanese-ceremony',
      content: 'The Japanese tea ceremony is a choreographed ritual...',
      bookmarked: false,
      notes: ''
    },
    {
      id: 'tea-7',
      slug: 'indian-tea-gardens',
      title: 'Indian Tea Gardens',
      description: 'Discover the famous tea growing regions of India',
      duration: '35 min',
      completed: false,
      type: 'reading',
      content: "India produces some of the world's finest teas in regions like Darjeeling...",
      bookmarked: false,
      notes: ''
    },
    {
      id: 'tea-8',
      slug: 'earl-grey-english-blends',
      title: 'Earl Grey and English Blends',
      description: 'Understanding British tea culture and popular blends',
      duration: '30 min',
      completed: false,
      type: 'video',
      videoUrl: 'https://example.com/english-blends',
      content: 'Earl Grey is one of the most popular flavored teas worldwide...',
      bookmarked: false,
      notes: ''
    }
  ],
  'tea-brewing': [
    {
      id: 'tea-9',
      slug: 'water-temperature-guide',
      title: 'Water Temperature Guide',
      description: 'Learn the optimal water temperatures for different tea types',
      duration: '20 min',
      completed: false,
      type: 'video',
      videoUrl: 'https://example.com/water-temp',
      content: 'Water temperature significantly affects tea extraction...',
      bookmarked: false,
      notes: ''
    },
    {
      id: 'tea-10',
      slug: 'steeping-time-mastery',
      title: 'Steeping Time Mastery',
      description: 'Practice timing your tea steeping for optimal flavor',
      duration: '25 min',
      completed: false,
      type: 'practice',
      content: 'Different teas require different steeping times to achieve balance...',
      bookmarked: false,
      notes: ''
    },
    {
      id: 'tea-11',
      slug: 'tea-equipment-essentials',
      title: 'Tea Equipment Essentials',
      description: 'Overview of essential tea brewing equipment and tools',
      duration: '30 min',
      completed: false,
      type: 'reading',
      content: 'Quality equipment can enhance your tea brewing experience...',
      bookmarked: false,
      notes: ''
    },
    {
      id: 'tea-12',
      slug: 'advanced-brewing-methods',
      title: 'Advanced Brewing Methods',
      description: 'Master advanced techniques like gongfu brewing and cold brewing',
      duration: '45 min',
      completed: false,
      type: 'video',
      videoUrl: 'https://example.com/advanced-brewing',
      content: 'Gongfu brewing allows for multiple short steeps...',
      bookmarked: false,
      notes: ''
    },
    {
      id: 'tea-13',
      slug: 'tea-brewing-assessment',
      title: 'Tea Brewing Assessment',
      description: 'Test your knowledge of tea brewing techniques',
      duration: '30 min',
      completed: false,
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          question: 'What is the optimal water temperature for green tea?',
          options: ['100°C', '80°C', '70°C', '60°C'],
          correctAnswer: 1,
          explanation: '80°C is ideal for green tea as it prevents bitterness while extracting flavor.'
        },
        {
          id: 'q2',
          question: 'How long should black tea typically steep?',
          options: ['1-2 minutes', '3-5 minutes', '7-10 minutes', '15+ minutes'],
          correctAnswer: 1,
          explanation: 'Black tea should steep for 3-5 minutes for optimal flavor balance.'
        },
        {
          id: 'q3',
          question: 'Which brewing method uses multiple short steeps?',
          options: ['Western brewing', 'Gongfu brewing', 'Cold brewing', 'Sun brewing'],
          correctAnswer: 1,
          explanation: "Gongfu brewing uses multiple short steeps to explore the tea's flavor evolution."
        }
      ],
      bookmarked: false,
      notes: ''
    }
  ]
};

const teaModules: Module[] = [
  {
    id: 'tea-basics',
    slug: 'tea-basics',
    title: 'Tea Fundamentals',
    description: 'Learn the basics of tea types and processing methods',
    duration: '90 min',
    difficulty: 'Easy',
    lessons: teaLessons['tea-basics']
  },
  {
    id: 'tea-varieties',
    slug: 'tea-varieties',
    title: 'Tea Varieties Around the World',
    description: 'Explore different tea varieties from various regions',
    duration: '120 min',
    difficulty: 'Medium',
    lessons: teaLessons['tea-varieties'],
    prerequisites: ['tea-basics']
  },
  {
    id: 'tea-brewing',
    slug: 'tea-brewing',
    title: 'Perfect Brewing Techniques',
    description: 'Master the art of brewing different types of tea',
    duration: '150 min',
    difficulty: 'Hard',
    lessons: teaLessons['tea-brewing'],
    prerequisites: ['tea-basics', 'tea-varieties']
  }
];

export const teaCourse: Course = {
  id: 'tea-mastery',
  slug: 'tea-mastery',
  title: 'Tea Mastery: From Leaf to Cup',
  description: 'Comprehensive guide to understanding tea varieties, brewing techniques, and tea culture from around the world.',
  instructor: 'Sarah Chen',
  instructorBio: 'Sarah is a certified tea sommelier with over 15 years of experience in tea cultivation and education. She has traveled extensively throughout Asia studying traditional tea practices.',
  instructorAvatar: '/instructors/sarah-chen.jpg',
  rating: 4.8,
  students: 1247,
  duration: '6 hours',
  level: 'Intermediate',
  modules: teaModules,
  icon: '🍃',
  color: 'bg-green-500',
  category: 'Tea',
  price: 89,
  originalPrice: 129,
  tags: ['Tea', 'Brewing', 'Culture', 'History', 'Tasting'],
  whatYouWillLearn: [
    'Understand different tea types and their characteristics',
    'Master proper brewing techniques for various teas',
    'Learn about tea culture and traditions worldwide',
    'Develop tea tasting and evaluation skills',
    'Identify high-quality teas and avoid common mistakes'
  ],
  requirements: [
    'Basic interest in tea and beverages',
    'Access to different types of tea for practice',
    'Basic kitchen equipment (kettle, teapot, cups)',
    'No prior tea knowledge required'
  ],
  targetAudience: [
    'Tea enthusiasts wanting to deepen their knowledge',
    'Beginners interested in learning about tea',
    'Hospitality professionals',
    'Anyone interested in Asian culture and traditions'
  ],
  language: 'English',
  lastUpdated: new Date('2024-01-01'),
  certificate: true
};
