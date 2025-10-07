import React, { useState, useEffect } from 'react';
import { useLibrary } from '../contexts/LibraryContext';

const AuthPage = ({ role }) => {
  const { handleLogin, handleRegister, showNotification } = useLibrary();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [isLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification('Email and password are required.', 'error');
      return;
    }

    if (isLogin) {
      handleLogin(email, password, role);
    } else {
      if (!name) {
        showNotification('Name is required for registration.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
      }
      const success = handleRegister(name, email, password, role);
      if (success) {
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">{isLogin ? 'Login' : 'Register'} as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>

        <div className="flex mb-6 space-x-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 text-center py-3 border-b-4 font-semibold rounded-t-lg transition-all ${
              isLogin ? (role === 'student' ? 'border-blue-600 text-blue-600' : 'border-green-600 text-green-600') : 'border-gray-300 text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 text-center py-3 border-b-4 font-semibold rounded-t-lg transition-all ${
              !isLogin ? (role === 'student' ? 'border-blue-600 text-blue-600' : 'border-green-600 text-green-600') : 'border-gray-300 text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-colors"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-colors"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">Enter a valid email address.</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long.</p>
          </div>
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <button
            type="submit"
            className={`w-full text-white font-bold py-3 rounded-lg transition-colors shadow-md ${
              role === 'student' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;