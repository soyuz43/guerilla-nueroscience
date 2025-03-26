// src/views/ArticleList.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { getArticles, deleteArticle } from './services/articleService'
import { getTagsForArticle, getAllTags } from './services/tagService'
import './assets/styles/main.css'

export const ArticleList = () => {
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [articleTags, setArticleTags] = useState({})
  const [allTags, setAllTags] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('guerilla_user'))

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load all necessary data in parallel
        const [articlesData, tagsData] = await Promise.all([
          getArticles(),
          getAllTags()
        ])

        setArticles(articlesData)
        setAllTags(tagsData)

        // Load tags for each article
        const tagsMap = {}
        for (const article of articlesData) {
          const tags = await getTagsForArticle(article.id)
          tagsMap[article.id] = tags.map(t => t.tag.name)
        }
        setArticleTags(tagsMap)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredArticles = articles.filter(article => {
    // Combine search and tag filters
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTag = !selectedTag || 
      (articleTags[article.id]?.includes(selectedTag))
    
    return matchesSearch && matchesTag
  })

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(id)
      setArticles(prev => prev.filter(article => article.id !== id))
    }
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="container">
      <h1>Research Articles</h1>
      
      {/* Filter Controls */}
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
          {allTags.map(tag => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
            </option>
          ))}
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
              {articleTags[article.id]?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <div className="article-actions">
              <Link to={`/articles/${article.id}`} className="submit-button">
                Read More
              </Link>
              {article.userId === user?.id && (
                <>
                  <Link
                    to={`/articles/${article.id}/edit`}
                    className="edit-button"
                  >
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