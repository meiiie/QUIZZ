import React, { useState } from 'react';

const TinhTrangHoanThanh = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - trong thực tế sẽ lấy từ API
  const mockQuizzes = [
    {
      id: 1,
      title: 'Math Quiz 01 - Giải tích cơ bản',
      department: 'CNTT',
      totalStudents: 45,
      completed: 38,
      pending: 7,
      averageScore: 85.2,
      deadline: '2025-08-25',
      status: 'active',
      createdDate: '2025-08-15'
    },
    {
      id: 2,
      title: 'Physics Chapter 3 - Cơ học',
      department: 'Kỹ thuật',
      totalStudents: 32,
      completed: 28,
      pending: 4,
      averageScore: 78.5,
      deadline: '2025-08-30',
      status: 'active',
      createdDate: '2025-08-18'
    },
    {
      id: 3,
      title: 'English Grammar Test',
      department: 'Ngoại ngữ',
      totalStudents: 28,
      completed: 28,
      pending: 0,
      averageScore: 92.1,
      deadline: '2025-08-20',
      status: 'completed',
      createdDate: '2025-08-10'
    },
    {
      id: 4,
      title: 'Economics Basic Concepts',
      department: 'Kinh tế',
      totalStudents: 35,
      completed: 22,
      pending: 13,
      averageScore: 76.8,
      deadline: '2025-09-01',
      status: 'active',
      createdDate: '2025-08-12'
    },
    {
      id: 5,
      title: 'Database Design Quiz',
      department: 'CNTT',
      totalStudents: 40,
      completed: 15,
      pending: 25,
      averageScore: 68.4,
      deadline: '2025-08-28',
      status: 'active',
      createdDate: '2025-08-20'
    }
  ];

  const filteredQuizzes = mockQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'completed') return matchesSearch && quiz.status === 'completed';
    if (filterStatus === 'active') return matchesSearch && quiz.status === 'active';
    if (filterStatus === 'high_completion') return matchesSearch && (quiz.completed / quiz.totalStudents) >= 0.8;
    
    return matchesSearch;
  });

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Hoàn thành</span>;
    return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Đang diễn ra</span>;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ✅ Hoàn thành Quiz
        </h1>
        <p className="text-gray-600">
          Theo dõi tình trạng hoàn thành các Quiz và tỷ lệ tham gia của học sinh
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên Quiz hoặc Khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex-shrink-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-48"
            >
              <option value="all">Tất cả Quiz</option>
              <option value="active">Đang diễn ra</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="high_completion">Tỷ lệ cao (≥80%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tổng Quiz</h3>
              <p className="text-2xl font-bold text-blue-600">{filteredQuizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Đã hoàn thành</h3>
              <p className="text-2xl font-bold text-green-600">
                {mockQuizzes.filter(q => q.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full flex-shrink-0">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Đang diễn ra</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {mockQuizzes.filter(q => q.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full flex-shrink-0">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ TB</h3>
              <p className="text-2xl font-bold text-purple-600">
                {(mockQuizzes.reduce((acc, q) => acc + (q.completed / q.totalStudents), 0) / mockQuizzes.length * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Danh sách Quiz ({filteredQuizzes.length} Quiz)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiến độ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm TB</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuizzes.map((quiz) => {
                const completionRate = (quiz.completed / quiz.totalStudents) * 100;
                return (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-500">Tạo: {quiz.createdDate}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {quiz.department}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 mb-1">
                        {quiz.completed}/{quiz.totalStudents} ({completionRate.toFixed(1)}%)
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${completionRate >= 80 ? 'bg-green-500' : completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getCompletionColor(quiz.averageScore)}`}>
                        {quiz.averageScore.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quiz.deadline}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(quiz.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Chi tiết</button>
                        <button className="text-green-600 hover:text-green-900">Nhắc nhở</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TinhTrangHoanThanh;
