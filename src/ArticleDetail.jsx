// src/views/ArticleDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { getArticleById, deleteArticle } from './services/articleService'
import './assets/styles/main.css'

export const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const user = localStorage.getItem('guerilla_user')
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      getArticleById(id)
        .then(data => {
          setArticle(data)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [id, user])

  const parsedUser = user ? JSON.parse(user) : null

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id)
        .then(() => navigate('/articles'))
        .catch(error => console.error('Error deleting article:', error))
    }
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="container">
      {isLoading ? (
        <div className="loading">Loading article details...</div>
      ) : (
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
          
          {parsedUser && article.userId === parsedUser.id && (
            <div className="article-actions">
              <Link
                to={`/articles/${id}/edit`}
                className="edit-button"
              >
                Edit
              </Link>
              <button
                className="delete-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}