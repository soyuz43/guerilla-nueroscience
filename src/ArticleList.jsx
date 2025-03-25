// src/views/ArticleList.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { getArticles, deleteArticle } from './services/articleService';
import './assets/styles/main.css';

export const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem('guerilla_user');

  useEffect(() => {
    getArticles()
      .then(data => {
        setArticles(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setIsLoading(false);
      });
  }, []);

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Parse the user object from localStorage
  const parsedUser = user ? JSON.parse(user) : null;

  // Handler to delete an article
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id)
        .then(() => {
          // Remove the deleted article from the state
          setArticles(articles.filter(article => article.id !== id));
        })
        .catch(error => {
          console.error('Error deleting article:', error);
        });
    }
  };

  if (!user) return <Navigate to="/login" replace />;

  if (isLoading) return <div className="container">Loading articles...</div>;

  return (
    <div className="container">
      <h1>Research Articles</h1>
      <input
        type="text"
        placeholder="Search articles..."
        className="input-field search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredArticles.length === 0 ? (
        <div className="article-card">
          <p>No articles found matching your search criteria.</p>
        </div>
      ) : (
        filteredArticles.map(article => (
          <div key={article.id} className="article-card">
            <h2>{article.title}</h2>
            <p>By {article.author || 'Anonymous Researcher'}</p>
            <p>{article.content?.substring(0, 150)}...</p>
            <div className="tags-container">
              {article.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <Link to={`/articles/${article.id}`} className="submit-button">
              Read More
            </Link>
            {/* Show delete button if the article belongs to the signed-in user */}
            {parsedUser && article.userId === parsedUser.id && (
              <button
                className="delete-button"
                onClick={() => handleDelete(article.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};