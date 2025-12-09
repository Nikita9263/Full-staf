import React, { useState } from 'react';
import './AddIdeaModal.css';

const AddIdeaModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    type: 'task'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onSubmit({
        ...formData,
        id: Date.now(),
        createdAt: new Date().toLocaleDateString(),
        likes: 0,
        comments: [],
        author: 'current-user'
      });
      setFormData({ title: '', description: '', category: 'Education', type: 'task' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>� Add New {formData.type === 'task' ? 'Task' : 'Idea'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="idea-form">
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="task">📋 Task (Looking for help/collaboration)</option>
              <option value="idea">💡 Idea (Sharing a concept/project)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">{formData.type === 'task' ? 'Task' : 'Idea'} Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={formData.type === 'task' ? 'What do you need help with?' : 'What\'s your brilliant idea?'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={formData.type === 'task' ? 'Describe what help you need, when, and any requirements...' : 'Describe your idea in detail...'}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Education">📚 Education & Study</option>
              <option value="Technology">💻 Technology & Programming</option>
              <option value="Research">🔬 Research & Projects</option>
              <option value="Social">👥 Social & Events</option>
              <option value="Business">💼 Business & Entrepreneurship</option>
              <option value="Health">🏥 Health & Wellness</option>
              <option value="Arts">🎨 Arts & Creative</option>
              <option value="Sports">⚽ Sports & Recreation</option>
              <option value="Other">🔖 Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              🚀 Submit {formData.type === 'task' ? 'Task' : 'Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIdeaModal;