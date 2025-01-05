import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundVideo from '../assets/background.mp4';


export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notification, setNotification] = useState({ message: '', isSuccess: false, isVisible: false });
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess, isVisible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:1080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      if (data.token) {
        console.log('Token received:', data.token);
        showNotification(data.message, true);
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        showNotification(data.message || 'Login failed. Please try again.', false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      showNotification(error.message, false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="glass p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
        <main>
          <div className="text-center mb-6">
            <Link to="/" className="text-2xl font-bold text-white hover:text-blue-300 transition">
              JustInvoice
            </Link>
          </div>
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Login</h2>
            <p className="text-sm sm:text-base text-gray-100">Hi, Welcome back 👋</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-white text-sm sm:text-base mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@dopeskulture.com"
                className="w-full px-3 py-2 text-sm sm:text-base border border-white/30 rounded-lg bg-white/20 text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-white text-sm sm:text-base mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-sm sm:text-base border border-white/30 rounded-lg bg-white/20 text-white focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center text-white"
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm sm:text-base font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              <span>{isLoading ? 'Logging in...' : 'Login'}</span>
              {isLoading && (
                <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-sm sm:text-base text-white">
            Don't have an account? <Link to="/register" className="text-blue-300 hover:underline">Register here</Link>
          </p>
        </main>
      </div>

      {notification.isVisible && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg text-white font-semibold z-50 ${notification.isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

