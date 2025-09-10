import { useEffect, useState } from "react";

interface Quiz {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  completed: number;
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    fetch("/api/teacher/quizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 Quiz List</h2>
      <ul className="space-y-2">
        {quizzes.map((q) => (
          <li key={q.id} className="p-3 rounded bg-gray-100">
            {q.title} - <span className="italic">{q.difficulty}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
