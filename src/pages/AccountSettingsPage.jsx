import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const AccountSettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    work: '',
    company: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/profile.php?action=index', {
          withCredentials: true
        });
        const userData = response.data;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          address: userData.address || '',
          work: userData.work || '',
          company: userData.company || '',
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } catch (err) {
        setError('Failed to load user data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.put(
        '/api/profile.php?action=update',
        {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          work: formData.work,
          company: formData.company,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(response.data.message || 'Profile updated successfully');

      // Update user context if name changed
      if (user && formData.name !== user.name) {
        setUser({ ...user, name: formData.name });
      }

      // Clear password fields (not handled by backend in this simple version)
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 pt-16 pb-10">
        <div className="w-full max-w-4xl p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-400">Manage your profile information and security settings</p>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                      Personal Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Physical Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Information & Password */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                      Work Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Position/Role</label>
                        <input
                          type="text"
                          name="work"
                          value={formData.work}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                      Change Password
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmNewPassword"
                          value={formData.confirmNewPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;