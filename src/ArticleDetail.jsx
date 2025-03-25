// src/views/ArticleDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getArticleById } from './services/articleService'
import './assets/styles/main.css'

export const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const user = localStorage.getItem('guerilla_user')

  useEffect(() => {
    if (user) {
      getArticleById(id).then(data => setArticle(data))
    }
  }, [id, user])

  if (!user) return <Navigate to="/login" replace />

  if (!article) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div className="article-card">
        <h1>{article.title}</h1>
        <p className="meta">By {article.author || 'Anonymous'} • {new Date(article.date).toLocaleDateString()}</p>
        <div className="tags">
          {article.tags?.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="content">
          {article.content}
        </div>
      </div>
    </div>
  )
}