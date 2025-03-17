import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios, { fetchCsrfToken } from '../api/axiosConfig';

const FeedbackPage = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState('');
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  // Fetch existing feedback on component mount
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('/routes/feedback');
        setFeedbackList(response.data);
      } catch (err) {
        setError('Failed to fetch feedback');
      }
    };
    fetchFeedback();
  }, []);

  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      await fetchCsrfToken();
      await axios.post('/routes/feedback', {
        user_id: user.uid,  // Ensure user_id is passed
        message: message,
      });
      setMessage('');
      setError('');
      // Refresh feedback list after submission
      const response = await axios.get('/routes/feedback');
      setFeedbackList(response.data);
    } catch (err) {
      setError('Failed to submit feedback');
    }
  };

  // Handle feedback deletion
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await axios.delete(`/routes/feedback/${feedbackId}`);
      // Refresh feedback list after deletion
      const response = await axios.get('/routes/feedback');
      setFeedbackList(response.data);
    } catch (err) {
      setError('Failed to delete feedback');
    }
  };

  // Handle feedback update
  const handleUpdateFeedback = async (feedbackId) => {
    if (!editMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      await axios.put(`/routes/feedback/${feedbackId}`, {
        message: editMessage,
      });
      setEditingFeedbackId(null);
      setEditMessage('');
      setError('');
      // Refresh feedback list after update
      const response = await axios.get('/routes/feedback');
      setFeedbackList(response.data);
    } catch (err) {
      setError('Failed to update feedback');
    }
  };

  return (
    <div className="min-h-screen bg-[#121826] text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-8">Feedback</h1>

        {/* Feedback Submission Form */}
        {user ? (
          <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full bg-[#0f172a] text-gray-200 p-4 rounded-lg border border-gray-700 focus:border-blue-400 focus:outline-none"
                rows="4"
                placeholder="Enter your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {error && <p className="text-red-400 mt-2">{error}</p>}
              <button
                type="submit"
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg mb-8">
            <p className="text-gray-300">
              Please <Link to="/login" className="text-blue-400 hover:text-blue-300">login</Link> to submit feedback.
            </p>
          </div>
        )}

        {/* Feedback List */}
        <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Feedback from Users</h2>
          {feedbackList.length > 0 ? (
            <ul className="space-y-4">
              {feedbackList.map((feedback) => (
                <li key={feedback.id} className="bg-[#0f172a] p-4 rounded-lg border border-gray-700">
                  {editingFeedbackId === feedback.id ? (
                    <div>
                      <textarea
                        className="w-full bg-[#1e293b] text-gray-200 p-2 rounded-lg border border-gray-700 focus:border-blue-400 focus:outline-none"
                        rows="3"
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                      />
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdateFeedback(feedback.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingFeedbackId(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300">{feedback.message}</p>
                      <p className="text-sm text-gray-500 mt-2">User ID: {feedback.user_id}</p>
                      {user && user.uid === feedback.user_id && (
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => {
                              setEditingFeedbackId(feedback.id);
                              setEditMessage(feedback.message);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFeedback(feedback.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">No feedback available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;