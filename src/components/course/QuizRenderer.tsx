"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types/lesson";

export interface QuizRendererProps {
  questions: QuizQuestion[];
}

export function QuizRenderer({ questions }: QuizRendererProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (id: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [id]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = questions.reduce((total: number, q: QuizQuestion) => {
    return total + (answers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-4">
      {questions.map((q: QuizQuestion) => (
        <div key={q.id} className="border border-slate-200 rounded-lg bg-white shadow-sm">
          <div className="p-4 space-y-2">
            <p className="font-medium text-slate-800">{q.question}</p>
            <div className="space-y-1">
              {q.options.map((opt: string, index: number) => (
                <label key={index} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={q.id}
                    value={index}
                    disabled={submitted}
                    checked={answers[q.id] === index}
                    onChange={() => handleAnswer(q.id, index)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm ${
                    submitted && index === q.correctAnswer 
                      ? "text-green-600 font-semibold" 
                      : "text-slate-700"
                  }`}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
            {submitted && (
              <div className="mt-2 space-y-1">
                <p className={`text-sm font-medium ${
                  answers[q.id] === q.correctAnswer ? "text-green-600" : "text-red-600"
                }`}>
                  {answers[q.id] === q.correctAnswer 
                    ? "✓ Correct" 
                    : `✗ Incorrect. Correct answer: ${q.options[q.correctAnswer]}`
                  }
                </p>
                {q.explanation && (
                  <p className="text-sm text-slate-600 italic">
                    {q.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      {!submitted && (
        <button 
          onClick={handleSubmit} 
          disabled={Object.keys(answers).length !== questions.length}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Submit Answers
        </button>
      )}
      {submitted && (
        <div className="text-center p-4 bg-slate-100 rounded-lg">
          <div className="text-lg font-semibold text-slate-700">
            Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
          </div>
          <div className="text-sm text-slate-600 mt-1">
            {score === questions.length ? "Perfect! 🎉" : 
             score >= questions.length * 0.7 ? "Good job! 👍" : 
             "Keep practicing! 💪"}
          </div>
        </div>
      )}
    </div>
  );
}