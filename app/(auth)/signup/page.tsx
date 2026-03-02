"use client";

import React, { useState } from 'react';

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    jobTitle: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-[480px] w-full">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <h1 className="text-slate-900 text-center text-3xl font-semibold">Register</h1>
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form className="mt-12 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 disabled:bg-gray-100"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 disabled:bg-gray-100"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 disabled:bg-gray-100"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Working as</label>
                <input
                  name="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 disabled:bg-gray-100"
                  placeholder="e.g. Support Agent"
                />
              </div>
              <div className="!mt-12">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:bg-gray-400"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
              <p className="text-slate-900 text-sm !mt-6 text-center">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
