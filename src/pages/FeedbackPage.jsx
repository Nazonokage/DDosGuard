import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axiosConfig';

const FeedbackPage = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('/api/feedback/');
      setFeedbackList(res.data);
    } catch {
      setError('Failed to fetch feedback');
    }
  };

  useEffect(() => { fetchFeedback(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) { setError('Please enter a message'); return; }
    try {
      await axios.post('/api/feedback/', { message });
      setMessage(''); setError('');
      fetchFeedback();
    } catch { setError('Failed to submit feedback'); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/feedback/${id}`);
      fetchFeedback();
    } catch { setError('Failed to delete feedback'); }
  };

  const handleUpdate = async (id) => {
    if (!editMessage.trim()) { setError('Please enter a message'); return; }
    try {
      await axios.put(`/api/feedback/${id}`, { message: editMessage });
      setEditingId(null); setEditMessage(''); setError('');
      fetchFeedback();
    } catch { setError('Failed to update feedback'); }
  };

  return (
    <div className="min-h-screen bg-[#121826] text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-8">Feedback</h1>

        {user ? (
          <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full bg-[#0f172a] text-gray-200 p-4 rounded-lg border border-gray-700 focus:border-blue-400 focus:outline-none"
                rows="4" placeholder="Enter your feedback..."
                value={message} onChange={(e) => setMessage(e.target.value)} />
              {error && <p className="text-red-400 mt-2">{error}</p>}
              <button type="submit"
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Submit
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg mb-8">
            <p>Please <Link to="/login" className="text-blue-400 hover:text-blue-300">login</Link> to submit feedback.</p>
          </div>
        )}

        <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Feedback from Users</h2>
          {feedbackList.length > 0 ? (
            <ul className="space-y-4">
              {feedbackList.map((fb) => (
                <li key={fb.id} className="bg-[#0f172a] p-4 rounded-lg border border-gray-700">
                  {editingId === fb.id ? (
                    <div>
                      <textarea
                        className="w-full bg-[#1e293b] text-gray-200 p-2 rounded-lg border border-gray-700 focus:border-blue-400 focus:outline-none"
                        rows="3" value={editMessage} onChange={(e) => setEditMessage(e.target.value)} />
                      <div className="flex space-x-2 mt-2">
                        <button onClick={() => handleUpdate(fb.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg">Save</button>
                        <button onClick={() => setEditingId(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-lg">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300">{fb.message}</p>
                      <p className="text-sm text-gray-500 mt-1">by {fb.name}</p>
                      {user && user.id === fb.user_id && (
                        <div className="flex space-x-2 mt-2">
                          <button onClick={() => { setEditingId(fb.id); setEditMessage(fb.message); }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg">Edit</button>
                          <button onClick={() => handleDelete(fb.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg">Delete</button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">No feedback yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
