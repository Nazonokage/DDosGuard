import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const AccountSettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', work: '', company: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/profile/')
      .then((res) => {
        const u = res.data;
        setFormData({
          name: u.name || '', email: u.email || '',
          address: u.address || '', work: u.work || '', company: u.company || '',
        });
      })
      .catch((err) => {
        setError('Failed to load user data');
        if (err.response?.status === 401) navigate('/login');
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await axios.put('/api/profile/', formData);
      setSuccess(res.data.message || 'Profile updated');
      if (user && formData.name !== user.name) setUser({ ...user, name: formData.name });
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      if (err.response?.status === 401) navigate('/login');
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-400">Manage your profile information</p>
          </div>
          <div className="p-6">
            {error   && <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">{error}</div>}
            {success && <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white pb-2 border-b border-gray-700">Personal Information</h2>
                  {[['name','Full Name','text',true],['email','Email Address','email',true],['address','Physical Address','text',false]].map(([name,label,type,req]) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
                      <input type={type} name={name} value={formData[name]} onChange={handleChange} required={req}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
                {/* Work */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white pb-2 border-b border-gray-700">Work Information</h2>
                  {[['work','Position/Role'],['company','Company']].map(([name,label]) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
                      <input type="text" name={name} value={formData[name]} onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
