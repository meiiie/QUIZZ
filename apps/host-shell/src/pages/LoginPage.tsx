import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button-new';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login attempt:', { username, password });
    
    // Giả lập API call
    if (username === 'student@test.com' && password === '123456') {
      console.log('Student login successful');
      login({ id: '1', name: 'Student User', role: 'student' }, 'fake-token-student');
      navigate('/student');
    } else if (username === 'admin@test.com' && password === '123456') {
      console.log('Admin login successful');
      login({ id: '2', name: 'Admin User', role: 'admin' }, 'fake-token-admin');
      navigate('/admin');
    } else if (username === 'teacher@test.com' && password === '123456') {
      console.log('Teacher login successful');
      login({ id: '3', name: 'Teacher User', role: 'teacher' }, 'fake-token-teacher');
      navigate('/teacher');
    } else {
      console.log('Login failed');
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="student@test.com, admin@test.com hoặc teacher@test.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="123456"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
