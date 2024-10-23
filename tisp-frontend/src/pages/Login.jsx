import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [credentials, setCredentials] = useState({ identifier: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', credentials);
      localStorage.setItem('token', response.data.token);
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      // Capture different error responses
      if (err.response && err.response.status === 401) {
        setMessage({text:err.response.data.message, type: 'error'});
      } else if (err.response && err.response.status === 403) {
        setMessage({text:err.response.data.message,type: 'error'});
      } else {
        setMessage({text:err.response.data.message,type: 'error'});
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side Content */}
      <div className="flex-1 flex flex-col justify-center p-16 bg-white">
      <div className="flex mb-9">
            <img src="/src/assets/logo.png" alt="logo" className="h-10 w-auto" />
            <img src="/src/assets/heading.png" alt="title" className='h-9 w-auto' />
        </div>
        <h1 className="text-3xl font-semibold mb-6 text-indigo-600">Login</h1>

        {message.text && (
          <div
            className={`p-4 mb-4 text-white rounded ${
              message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            name="identifier"
            placeholder="Username or Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="input"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn">Login</button>
        </form>
      </div>

      {/* Right Side Background Image */}
      <div className="hidden md:block w-1/2 bg-my bg-cover bg-center" />
    </div>
    
  );
}

export default Login;
