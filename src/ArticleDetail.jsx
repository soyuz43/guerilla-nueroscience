// src/views/ArticleDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getArticleById, deleteArticle } from './services/articleService';
import './assets/styles/main.css';

export const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const user = localStorage.getItem('guerilla_user');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getArticleById(id).then(data => setArticle(data));
    }
  }, [id, user]);

  // Parse the user object from localStorage
  const parsedUser = user ? JSON.parse(user) : null;

  // Handler to delete the article
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id)
        .then(() => {
          // Redirect to the article list after deletion
          navigate('/articles');
        })
        .catch(error => {
          console.error('Error deleting article:', error);
        });
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  if (!article) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="article-card">
        <h1>{article.title}</h1>
        <p className="meta">
          By {article.author || 'Anonymous'} • {new Date(article.date).toLocaleDateString()}
        </p>
        <div className="tags">
          {article.tags?.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="content">
          {article.content}
        </div>
        {/* Show delete button if the article belongs to the signed-in user */}
        {parsedUser && article.userId === parsedUser.id && (
          <button
            className="delete-button"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};