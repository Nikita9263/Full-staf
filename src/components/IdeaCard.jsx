import React, { useState } from 'react';
import './IdeaCard.css';

const IdeaCard = ({ idea, onLike, onEdit, onDelete, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      Education: '#8B5CF6',
      Technology: '#3B82F6',
      Research: '#10B981',
      Social: '#F59E0B',
      Business: '#059669',
      Health: '#EF4444',
      Arts: '#F97316',
      Sports: '#06B6D4',
      Other: '#6B7280'
    };
    return colors[category] || colors.Other;
  };

  const getTypeIcon = (type) => {
    return type === 'task' ? '📋' : '💡';
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(idea.id, newComment.trim());
      setNewComment('');
      setShowCommentForm(false);
    }
  };

  const isCurrentUser = idea.author === 'current-user';

  return (
    <div className="idea-card">
      <div className="idea-header">
        <div className="title-section">
          <div className="type-indicator">
            {getTypeIcon(idea.type)} {idea.type === 'task' ? 'Task' : 'Idea'}
          </div>
          <h3 className="idea-title">{idea.title}</h3>
        </div>
        <div className="header-actions">
          <span 
            className="idea-category" 
            style={{ backgroundColor: getCategoryColor(idea.category) }}
          >
            {idea.category}
          </span>
          {isCurrentUser && (
            <div className="owner-actions">
              <button className="edit-btn" onClick={() => onEdit(idea)} title="Edit">
                ✏️
              </button>
              <button className="delete-btn" onClick={() => onDelete(idea.id)} title="Delete">
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="idea-description">{idea.description}</p>
      
      <div className="idea-footer">
        <span className="idea-date">{getTypeIcon(idea.type)} {idea.createdAt}</span>
        <div className="idea-actions">
          <button 
            className={`like-btn ${idea.liked ? 'liked' : ''}`}
            onClick={() => onLike(idea.id)}
          >
            👍 {idea.likes}
          </button>
          <button 
            className="comment-btn"
            onClick={() => setShowComments(!showComments)}
          >
            💬 {idea.comments.length}
          </button>
          <button 
            className="add-comment-btn"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            ➕ Comment
          </button>
        </div>
      </div>

      {showCommentForm && (
        <div className="comment-form">
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="2"
            />
            <div className="comment-form-actions">
              <button type="button" onClick={() => setShowCommentForm(false)}>Cancel</button>
              <button type="submit">Post Comment</button>
            </div>
          </form>
        </div>
      )}

      {showComments && idea.comments.length > 0 && (
        <div className="comments-section">
          <h4>Comments:</h4>
          {idea.comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.author}</strong>
                <span className="comment-date">{comment.createdAt}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeaCard;