// src/views/ArticleForm.jsx
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { createArticle } from './services/articleService';
import './assets/styles/main.css';

export const ArticleForm = () => {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    author: '', // Default is empty, will be populated dynamically
    tags: []
  });

  const navigate = useNavigate();
  const user = localStorage.getItem('guerilla_user'); // Retrieve user data from localStorage

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse the user object from localStorage
    const parsedUser = JSON.parse(user);

    // Create the new article object with the author field populated
    const newArticle = {
      ...article,
      date: new Date().toISOString(),
      userId: parsedUser?.id, // Use the user's ID
      author: parsedUser?.fullName || 'Anonymous' // Use the user's fullName or fallback to 'Anonymous'
    };

    // Submit the article to the backend
    createArticle(newArticle).then(() => {
      navigate('/articles');
    });
  };

  // Redirect to login if no user is signed in
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container">
      <h1>Submit New Research</h1>
      <form onSubmit={handleSubmit} className="article-card">
        {/* Title Field */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="input-field"
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            required
          />
        </div>

        {/* Content Field */}
        <div className="form-group">
          <label>Content</label>
          <textarea
            className="input-field"
            value={article.content}
            onChange={(e) => setArticle({ ...article, content: e.target.value })}
            rows="10"
            required
          />
        </div>

        {/* Tags Field */}
        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            className="input-field"
            value={article.tags.join(',')}
            onChange={(e) =>
              setArticle({
                ...article,
                tags: e.target.value.split(',').map((t) => t.trim())
              })
            }
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Publish Article
        </button>
      </form>
    </div>
  );
};