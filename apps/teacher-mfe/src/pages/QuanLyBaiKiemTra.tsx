import React from 'react';
import { useQuizzes } from '../hooks/useApi';

export default function QuanLyBaiKiemTra() {
  const { data, loading, error } = useQuizzes();

  if (loading === 'loading') {
    return <div className="p-6">Loading quizzes...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-800">Error loading quizzes: {error}</div>
      </div>
    );
  }

  const quizzes = data?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Quizzes</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Quiz List</h2>
        </div>
        
        {quizzes.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {quizzes.map((quiz: any) => (
              <div key={quiz.id} className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Status: {quiz.status}</span>
                  <span>Questions: {quiz.questionCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No quizzes found
          </div>
        )}
      </div>

      {/* Debug */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Debug Data</h3>
        <pre className="text-sm bg-white p-4 rounded border overflow-auto max-h-64">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
