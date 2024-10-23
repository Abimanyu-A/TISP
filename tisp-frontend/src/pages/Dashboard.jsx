import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RealTimeChat from '../components/RealTimeChat';
import ReportUpload from '../components/ReportUpload';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
      <div className="flex mb-9">
            <img src="/src/assets/logo.png" alt="logo" className="h-10 w-auto" />
            <img src="/src/assets/heading.png" alt="title" className='h-9 w-auto' />
        </div>
        <p className="text-lg text-gray-600">Welcome to your dashboard!</p>
        <ReportUpload />
      </div>
      <nav className="w-64 bg-gray-800 text-white p-6">
        <ul className="space-y-4">
          <li>
            <a href="/dashboard" className="block text-lg hover:text-gray-300">Dashboard</a>
          </li>
          <li>
            <a
              href="#"
              className="block text-lg hover:text-gray-300"
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
            >
              Logout
            </a>
          </li>
        </ul>
      </nav>
      <RealTimeChat/>
    </div>
  );
}

export default Dashboard;
