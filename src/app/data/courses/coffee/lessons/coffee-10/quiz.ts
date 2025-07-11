import { QuizQuestion } from "@/types/course";

export const Quiz: QuizQuestion[] = [
     {
      id: "q1",
      question: "What chemical process contributes to flavor development during roasting?",
      options: ["Evaporation", "Fermentation", "Maillard Reaction", "Oxidation"],
      correctAnswer: 2,
      explanation: "The Maillard reaction creates complex flavor compounds in roasted coffee."
    },
    {
      id: "q2",
      question: "What is 'first crack' in roasting?",
      options: ["A type of roast defect", "Initial audible popping", "Cooling phase", "Rest period"],
      correctAnswer: 1,
      explanation: "First crack signals the beginning of light roast development."
    }
  ];