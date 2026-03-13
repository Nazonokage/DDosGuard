import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    address: '', work: '', company: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('/api/auth/register', {
        name: form.name, email: form.email, password: form.password,
        address: form.address, work: form.work, company: form.company,
      });
      if (res.data.message) navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md neumorphic">
        <h1 className="text-2xl font-bold text-center text-white">Create Account</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          {[
            { name: 'name',            placeholder: 'Name',                type: 'text',     required: true },
            { name: 'email',           placeholder: 'Email',               type: 'email',    required: true },
            { name: 'password',        placeholder: 'Password',            type: 'password', required: true },
            { name: 'confirmPassword', placeholder: 'Confirm Password',    type: 'password', required: true },
            { name: 'address',         placeholder: 'Address',             type: 'text' },
            { name: 'work',            placeholder: 'Work Position/Role',  type: 'text' },
            { name: 'company',         placeholder: 'Company/Workplace',   type: 'text' },
          ].map((f) => (
            <input key={f.name} type={f.type} name={f.name}
              placeholder={f.placeholder} value={form[f.name]}
              onChange={handleChange} required={!!f.required}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          ))}
          <button type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}>Log in</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
