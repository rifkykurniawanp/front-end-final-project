import { QuizQuestion } from "@/types/course";

export const Quiz: QuizQuestion[] = [ {
    id: "q1",
    question: "Which of the following is a correct ratio for making herbal tinctures using alcohol?",
    options: [
      "1 part herb : 10 parts alcohol",
      "1 part herb : 1 part alcohol",
      "10 parts herb : 1 part alcohol",
      "1 part herb : 5 parts alcohol"
    ],
    correctAnswer: 0,
    explanation: "A 1:10 herb-to-alcohol ratio is a common standard for dry herbs in tincture preparation.",
  },
  {
    id: "q2",
    question: "Which herb is best known for supporting sleep and relaxation?",
    options: ["Echinacea", "Valerian", "Ginger", "Peppermint"],
    correctAnswer: 1,
    explanation: "Valerian is a potent sedative herb often used for sleep disorders and anxiety.",
  },
  {
    id: "q3",
    question: "What is the main reason for drying herbs before storing?",
    options: [
      "To enhance their flavor",
      "To make them lighter in weight",
      "To prevent mold and preserve potency",
      "To make them easier to grind"
    ],
    correctAnswer: 2,
    explanation: "Proper drying prevents microbial growth and maintains the medicinal properties of herbs.",
  },
  {
    id: "q4",
    question: "Which preparation is typically used for external/topical use?",
    options: ["Infusion", "Tincture", "Decoction", "Salve"],
    correctAnswer: 3,
    explanation: "Salves are used externally and made from infused oils and wax for skin application.",
  },
  {
    id: "q5",
    question: "Which solvent is commonly used in tincture making for extracting alcohol-soluble constituents?",
    options: ["Water", "Olive oil", "Glycerin", "Ethanol"],
    correctAnswer: 3,
    explanation: "Ethanol (alcohol) is the standard solvent for extracting a wide range of herbal constituents.",
  }
];