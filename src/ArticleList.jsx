// src/views/ArticleList.jsx
import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { getArticles, deleteArticle } from './services/articleService'
import { getTagsForArticle, getAllTags, deleteArticleTagsByArticleId } from './services/tagService'
import './assets/styles/main.css'

export const ArticleList = () => {
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [articleTags, setArticleTags] = useState({})
  const [allTags, setAllTags] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('guerilla_user'))

  // Function to load articles and associated tags
  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [articlesResponse, tagsResponse] = await Promise.all([
        getArticles().catch(() => []),
        getAllTags().catch(() => [])
      ])

      const articlesData = Array.isArray(articlesResponse) ? articlesResponse : []
      const tagsData = Array.isArray(tagsResponse) ? tagsResponse : []

      setArticles(articlesData)
      setAllTags(tagsData)

      // Build a mapping of article IDs to their tags
      const tagsMap = {}
      for (const article of articlesData) {
        try {
          const tags = await getTagsForArticle(article.id)
          tagsMap[article.id] = tags.map(t => t.tag?.name || '').filter(Boolean)
        } catch (err) {
          tagsMap[article.id] = []
        }
      }
      setArticleTags(tagsMap)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Updated delete handler that accepts an article ID
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id)
        .then(() => {
          return deleteArticleTagsByArticleId(id)
        })
        .then(() => loadData()) // Re-fetch data after deletion
        .catch(error => console.error('Error deleting article:', error))
    }
  }

  if (!user) return <Navigate to="/login" replace />

  const filteredArticles = (articles || []).filter(article => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || (articleTags[article.id]?.includes(selectedTag))
    return matchesSearch && matchesTag
  })

  return (
    <div className="container">
      <h1>Research Articles</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search articles..."
          className="input-field search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="tag-filter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {Array.isArray(allTags) &&
            allTags.map(tag => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))
          }
        </select>
      </div>

      {isLoading ? (
        <div className="loading">Loading articles...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="no-results">No articles found matching your criteria</div>
      ) : (
        filteredArticles.map(article => (
          <div key={article.id} className="article-card">
            <h2>{article.title}</h2>
            <p className="article-meta">
              By {article.author} • {new Date(article.date).toLocaleDateString()}
            </p>
            <p>{article.content.substring(0, 150)}...</p>
            
            <div className="tags-container">
              {(articleTags[article.id] || []).map((tag, index) => (
                <span key={`${tag}-${index}`} className="tag">{tag}</span>
              ))}
            </div>

            <div className="article-actions">
              <Link to={`/articles/${article.id}`} className="submit-button">
                Read More
              </Link>
              {article.userId === user?.id && (
                <>
                  <Link to={`/articles/${article.id}/edit`} className="edit-button">
                    Edit
                  </Link>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(article.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
