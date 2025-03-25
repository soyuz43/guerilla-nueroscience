// src/views/ArticleForm.jsx
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { createArticle } from './services/articleService'
import './assets/styles/main.css'

export const ArticleForm = () => {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    author: '',
    tags: []
  })
  const navigate = useNavigate()
  const user = localStorage.getItem('guerilla_user')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newArticle = {
      ...article,
      date: new Date().toISOString(),
      userId: JSON.parse(user)?.id
    }

    createArticle(newArticle).then(() => {
      navigate('/articles')
    })
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="container">
      <h1>Submit New Research</h1>
      <form onSubmit={handleSubmit} className="article-card">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="input-field"
            value={article.title}
            onChange={(e) => setArticle({...article, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            className="input-field"
            value={article.content}
            onChange={(e) => setArticle({...article, content: e.target.value})}
            rows="10"
            required
          />
        </div>

        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            className="input-field"
            value={article.tags.join(',')}
            onChange={(e) => setArticle({
              ...article, 
              tags: e.target.value.split(',').map(t => t.trim())
            })}
          />
        </div>

        <button type="submit" className="submit-button">
          Publish Article
        </button>
      </form>
    </div>
  )
}