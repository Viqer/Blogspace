import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlogDetail.css';
import Navbar from '../forum/Navbar';

const APP_BASE = process.env.REACT_APP_BASE_URL || process.env.APP_BASE || '';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'blog' or commentId
  const [pendingDelete, setPendingDelete] = useState(null);
  const username = localStorage.getItem('blogspaceUser');
  const role = localStorage.getItem('blogspaceRole');

  useEffect(() => {
    fetch(`${APP_BASE}/blogs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok: ' + res.status);
        return res.json();
      })
      .then(data => setBlog(data))
      .catch(err => setError(err.message));

    fetch(`${APP_BASE}/comments/${id}`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('blogspaceToken');
    fetch(`${APP_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ blogId: id, content: comment }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(newComment => {
        setComments([newComment, ...comments]);
        setComment('');
      });
  };

  const handleDeleteBlog = () => {
    setConfirmType('blog');
    setShowConfirm(true);
  };

  const handleDeleteComment = (commentId) => {
    setConfirmType('comment');
    setPendingDelete(commentId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('blogspaceToken');
    if (confirmType === 'blog') {
      try {
        const res = await fetch(`${APP_BASE}/blogs/${id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to delete blog');
        window.location.href = '/blogs';
      } catch (err) {
        setError(err.message);
      }
    } else if (confirmType === 'comment' && pendingDelete) {
      try {
        const res = await fetch(`${APP_BASE}/comments/${pendingDelete}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to delete comment');
        setComments(comments.filter(c => c._id !== pendingDelete));
      } catch (err) {
        setError(err.message);
      }
    }
    setShowConfirm(false);
    setConfirmType(null);
    setPendingDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setConfirmType(null);
    setPendingDelete(null);
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!blog) return <div>Loading...</div>;

  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className="blogdetail-page">
      <Navbar />
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-popup">
            <div className="modal-title">This action cannot be undone. Would you like to proceed?</div>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-danger" onClick={confirmDelete}>Yes, Delete</button>
              <button className="modal-btn" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <main className="blogdetail-main container">
        <div className="blogdetail-card">
          <div className="blogdetail-card__header">
            <h2 className="blogdetail-card__title">{blog.title}</h2>
            {(username === blog.user?.username || role === 'admin') && (
              <button className="blog-delete-btn" onClick={handleDeleteBlog}>Delete Blog</button>
            )}
          </div>
          <div className="blogdetail-card__meta">
            <span>By {blog.user?.username || 'Unknown'}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="blogdetail-card__body blog-content">
            {blog.content}
          </div>
          <div className="blogdetail-card__footer">
            <span>Rating: {blog.rating || 0}</span>
            <span>Comments: {blog.commentCount || safeComments.length}</span>
          </div>
        </div>
        <div className="blogdetail-comments">
          <h3>Comments</h3>
          <form className="blogdetail-comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit" className="blogdetail-cta">Post Comment</button>
          </form>
          <div className="blogdetail-comments-list">
            {safeComments.length > 0 ? safeComments.map(c => (
              <div className="blogdetail-comment" key={c._id}>
                <div className="blogdetail-comment__meta">
                  <span>{c.user?.username || 'Anonymous'}</span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                  {(username === c.user?.username || role === 'admin') && (
                    <button className="comment-delete-btn" onClick={() => handleDeleteComment(c._id)}>Delete</button>
                  )}
                </div>
                <div className="blogdetail-comment__body">{c.content}</div>
              </div>
            )) : <div style={{ color: '#888' }}>No comments yet.</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BlogDetail;
