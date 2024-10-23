import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match!', type: 'error' });
      return;
    }
    try {
      await axios.post('http://localhost:4000/register', formData);
      setMessage({ text: 'Registration successful! Please log in.', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Error registering user. Try again.', type: 'error' });
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
        <h2 className="text-3xl font-semibold mb-6 text-indigo-600">Register</h2>

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
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            className="input"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="input"
            name="email"
            placeholder="Email Address"
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
          <input
            type="password"
            className="input"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn">Register</button>
        </form>
      </div>

      {/* Right Side Background Image */}
      <div className="hidden md:block w-1/2 bg-my bg-cover bg-center" />
    </div>
  );
}

export default Register;
