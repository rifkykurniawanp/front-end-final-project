"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizRendererProps {
  questions: QuizQuestion[];
}

export function QuizRenderer({ questions }: QuizRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (id: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = questions.reduce((total, q) => {
    return total + (answers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <Card key={q.id} className="border border-slate-200">
          <CardContent className="space-y-2 py-4">
            <p className="font-medium text-slate-800">{q.question}</p>
            <div className="space-y-1">
              {q.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    disabled={submitted}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswer(q.id, opt)}
                  />
                  <span className={`text-sm ${submitted && opt === q.correctAnswer ? "text-green-600 font-semibold" : "text-slate-700"}`}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
            {submitted && (
              <p className={`text-sm ${answers[q.id] === q.correctAnswer ? "text-green-600" : "text-red-600"}`}>
                {answers[q.id] === q.correctAnswer ? "Correct" : `Incorrect. Correct answer: ${q.correctAnswer}`}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
      {!submitted && (
        <Button onClick={handleSubmit} className="w-full">
          Submit Answers
        </Button>
      )}
      {submitted && (
        <div className="text-center text-lg font-semibold text-slate-700">
          Score: {score}/{questions.length}
        </div>
      )}
    </div>
  );
}