import { QuizQuestion } from "@/types/course";

export const Quiz: QuizQuestion[] = [
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
    ]