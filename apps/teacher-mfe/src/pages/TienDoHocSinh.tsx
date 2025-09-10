import React, { useState } from 'react';

const TienDoHocSinh = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - trong thực tế sẽ lấy từ API
  const mockStudents = [
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      studentId: 'IT001', 
      department: 'CNTT',
      completed: 8, 
      total: 10, 
      percentage: 80,
      lastActivity: '2 giờ trước',
      avgScore: 85.5
    },
    { 
      id: 2, 
      name: 'Trần Thị B', 
      studentId: 'IT002', 
      department: 'CNTT',
      completed: 9, 
      total: 10, 
      percentage: 90,
      lastActivity: '1 ngày trước',
      avgScore: 92.3
    },
    { 
      id: 3, 
      name: 'Lê Văn C', 
      studentId: 'IT003', 
      department: 'CNTT',
      completed: 6, 
      total: 10, 
      percentage: 60,
      lastActivity: '3 ngày trước',
      avgScore: 75.0
    },
    { 
      id: 4, 
      name: 'Phạm Thị D', 
      studentId: 'ECO001', 
      department: 'Kinh tế',
      completed: 10, 
      total: 10, 
      percentage: 100,
      lastActivity: '30 phút trước',
      avgScore: 95.8
    },
    { 
      id: 5, 
      name: 'Hoàng Văn E', 
      studentId: 'FL001', 
      department: 'Ngoại ngữ',
      completed: 4, 
      total: 10, 
      percentage: 40,
      lastActivity: '1 tuần trước',
      avgScore: 68.2
    }
  ];

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'excellent') return matchesSearch && student.percentage >= 80;
    if (filterStatus === 'good') return matchesSearch && student.percentage >= 60 && student.percentage < 80;
    if (filterStatus === 'needs_improvement') return matchesSearch && student.percentage < 60;
    
    return matchesSearch;
  });

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 80) return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Xuất sắc</span>;
    if (percentage >= 60) return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Khá</span>;
    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Cần cải thiện</span>;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          👥 Tiến độ học sinh
        </h1>
        <p className="text-gray-600">
          Theo dõi chi tiết tiến độ hoàn thành Quiz và điểm số của từng học sinh
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc MSSV..."
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
              <option value="all">Tất cả trạng thái</option>
              <option value="excellent">Xuất sắc (≥80%)</option>
              <option value="good">Khá (60-79%)</option>
              <option value="needs_improvement">Cần cải thiện (&lt;60%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Overview - Fixed Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
              <span className="text-2xl">👨‍🎓</span>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tổng học sinh</h3>
              <p className="text-2xl font-bold text-blue-600">{filteredStudents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Xuất sắc</h3>
              <p className="text-2xl font-bold text-green-600">
                {mockStudents.filter(s => s.percentage >= 80).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full flex-shrink-0">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Điểm TB</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {(mockStudents.reduce((acc, s) => acc + s.avgScore, 0) / mockStudents.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Cần hỗ trợ</h3>
              <p className="text-2xl font-bold text-red-600">
                {mockStudents.filter(s => s.percentage < 60).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Danh sách chi tiết ({filteredStudents.length} học sinh)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiến độ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm TB</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoạt động</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.studentId}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {student.department}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 mb-1">
                      {student.completed}/{student.total} Quiz ({student.percentage}%)
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${student.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.avgScore}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(student.percentage)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastActivity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Chi tiết</button>
                      <button className="text-green-600 hover:text-green-900">Nhắc nhở</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TienDoHocSinh;
