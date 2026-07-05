import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setAuthUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });
      setAuthUser(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication system failure');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Sales Application Secure System</h2>
        {error && <div className="p-3 mb-4 text-sm bg-red-100 text-red-700 rounded-md">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Workspace Email Address</label>
          <input type="email" required className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Access Security Password</label>
          <input type="password" required className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200">System Gateway Login</button>
      </form>
    </div>
  );
}