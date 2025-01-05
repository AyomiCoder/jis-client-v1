import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundVideo from '../assets/background.mp4';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessType: '',
    email: '',
    phoneNumber: '',
    state: '',
    country: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState({ text: '', color: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [notification, setNotification] = useState({ message: '', isSuccess: false, isVisible: false });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (name === 'confirmPassword') {
      setPasswordMismatch(value !== formData.password);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[!@#$%^&*]+/)) strength++;

    switch (strength) {
      case 0:
      case 1:
        return { text: 'Very Weak', color: 'text-red-500' };
      case 2:
        return { text: 'Weak', color: 'text-orange-500' };
      case 3:
        return { text: 'Medium', color: 'text-yellow-500' };
      case 4:
        return { text: 'Strong', color: 'text-green-500' };
      case 5:
        return { text: 'Very Strong', color: 'text-green-700' };
      default:
        return { text: '', color: '' };
    }
  };

  const showNotification = (message, isSuccess) => {
    setNotification({ message, isSuccess, isVisible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:1080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.message === 'User registered successfully') {
        showNotification('Registration successful!', true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showNotification('Registration failed: ' + data.message, false);
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('An error occurred during registration. Please try again later.', false);
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

      <div className="glass p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl relative z-10">
        <main>
          <div className="text-center mb-6">
            <Link to="/" className="text-2xl font-bold text-white hover:text-blue-300 transition">JustInvoice</Link>
          </div>
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Sign Up</h2>
            <p className="text-sm sm:text-base text-gray-100">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
              { name: 'businessName', label: 'Business Name', placeholder: 'Your Business Name' },
              { name: 'businessType', label: 'Business Type', placeholder: 'e.g. Sole Proprietorship' },
              { name: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
              { name: 'phoneNumber', label: 'Phone Number', placeholder: '+1 (555) 123-4567', type: 'tel' },
              { name: 'state', label: 'State', placeholder: 'Your State' },
              { name: 'country', label: 'Country', placeholder: 'Your Country' },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-white text-sm sm:text-base mb-2">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-white/30 rounded-lg bg-white/20 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label htmlFor="password" className="block text-white text-sm sm:text-base mb-2">Password</label>
              <div className="relative flex items-center">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 text-sm sm:text-base border border-white/30 rounded-lg bg-white/20 text-white focus:outline-none focus:border-blue-500"
                  minLength="8"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
                  title="Must contain at least one number, one uppercase and lowercase letter, one special character (!@#$%^&*), and at least 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute right-2 p-1 text-white"
                  aria-label="Toggle password visibility"
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-2">
                <div id="password-strength" className={`text-sm ${passwordStrength.color}`}>
                  {passwordStrength.text && `Password strength: ${passwordStrength.text}`}
                </div>
                <ul className="text-xs text-gray-300 mt-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Contains at least one uppercase letter</li>
                  <li>Contains at least one lowercase letter</li>
                  <li>Contains at least one number</li>
                  <li>Contains at least one special character (!@#$%^&*)</li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="confirm-password" className="block text-white text-sm sm:text-base mb-2">Confirm Password</label>
              <div className="relative flex items-center">
                <input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 text-sm sm:text-base border border-white/30 rounded-lg bg-white/20 text-white focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute right-2 p-1 text-white"
                  aria-label="Toggle confirm password visibility"
                >
                  {confirmPasswordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  )}
                </button>
              </div>
              {passwordMismatch && <div className="text-red-500 text-sm mt-1">Passwords do not match</div>}
            </div>

            <div className="md:col-span-2 mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm sm:text-base font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Registering...' : 'Register'}</span>
                {isLoading && (
                  <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm sm:text-base text-white">
            Already have an account? <Link to="/login" className="text-blue-300 hover:underline">Login here</Link>
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
};

export default Register;

