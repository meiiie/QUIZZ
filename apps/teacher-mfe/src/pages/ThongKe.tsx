import React from 'react';

const ThongKe = () => {
  // Mock data - trong thực tế sẽ lấy từ API
  const overallStats = {
    totalQuizzes: 24,
    totalStudents: 156,
    completedQuizzes: 89,
    averageScore: 82.5,
    totalDepartments: 4,
    activeTeachers: 8
  };

  const departmentStats = [
    { name: 'Khoa CNTT', students: 65, completed: 52, percentage: 80, avgScore: 85.2 },
    { name: 'Khoa Kinh tế', students: 45, completed: 38, percentage: 84.4, avgScore: 81.7 },
    { name: 'Khoa Ngoại ngữ', students: 28, completed: 20, percentage: 71.4, avgScore: 78.9 },
    { name: 'Khoa Kỹ thuật', students: 18, completed: 15, percentage: 83.3, avgScore: 88.1 }
  ];

  const recentTrends = [
    { month: 'Tháng 1', completed: 45, total: 60, percentage: 75 },
    { month: 'Tháng 2', completed: 52, total: 65, percentage: 80 },
    { month: 'Tháng 3', completed: 58, total: 70, percentage: 82.9 },
    { month: 'Tháng 4', completed: 61, total: 72, percentage: 84.7 },
    { month: 'Tháng 5', completed: 65, total: 75, percentage: 86.7 }
  ];

  const topPerformers = [
    { name: 'Phạm Thị D', department: 'Kinh tế', score: 95.8, quizzes: '10/10' },
    { name: 'Trần Thị B', department: 'CNTT', score: 92.3, quizzes: '9/10' },
    { name: 'Mai Văn L', department: 'Kỹ thuật', score: 88.1, quizzes: '12/15' },
    { name: 'Nguyễn Văn A', department: 'CNTT', score: 85.5, quizzes: '8/10' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Thống kê tổng quan
        </h1>
        <p className="text-gray-600">
          Tổng quan về hoạt động Quiz trong hệ thống và hiệu suất của các khoa
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tổng Quiz</h3>
              <p className="text-2xl font-bold text-blue-600">{overallStats.totalQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tổng học sinh</h3>
              <p className="text-2xl font-bold text-green-600">{overallStats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Điểm TB chung</h3>
              <p className="text-2xl font-bold text-purple-600">{overallStats.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Số khoa</h3>
              <p className="text-2xl font-bold text-yellow-600">{overallStats.totalDepartments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Giáo viên</h3>
              <p className="text-2xl font-bold text-indigo-600">{overallStats.activeTeachers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hoàn thành</h3>
              <p className="text-2xl font-bold text-red-600">{overallStats.completedQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ hoàn thành</h3>
              <p className="text-2xl font-bold text-teal-600">
                {((overallStats.completedQuizzes / overallStats.totalQuizzes) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tăng trưởng</h3>
              <p className="text-2xl font-bold text-pink-600">+12.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Hiệu suất theo Khoa</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoàn thành</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm TB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xếp hạng</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentStats.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{dept.students}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{dept.completed}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">{dept.percentage.toFixed(1)}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${dept.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dept.avgScore}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index === 0 && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">#1</span>}
                    {index === 1 && <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">#2</span>}
                    {index === 2 && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">#3</span>}
                    {index === 3 && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">#4</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trends and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Xu hướng 5 tháng gần đây</h2>
          <div className="space-y-3">
            {recentTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">{trend.month}</div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">{trend.completed}/{trend.total}</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${trend.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-green-600 w-12">{trend.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top học sinh xuất sắc</h2>
          <div className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <span className="text-sm font-medium">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">{student.score}</div>
                  <div className="text-xs text-gray-500">{student.quizzes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKe;
