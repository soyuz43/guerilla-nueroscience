// src/views/ArticleForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { createArticle } from './services/articleService'
import { getTags, createTag, createArticleTag } from './services/tagService'
import './assets/styles/main.css'

export const ArticleForm = () => {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    tagInput: ''
  })
  const [existingTags, setExistingTags] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('guerilla_user'))

  useEffect(() => {
    getTags().then(tags => {
      console.log("Fetched tags:", tags) // Debug
      setExistingTags(tags)
    })
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Create article
      const newArticle = await createArticle({
        title: article.title,
        content: article.content,
        date: new Date().toISOString(),
        userId: user?.id,
        author: user?.fullName || 'Anonymous'
      })
  
      // Process tags
      const tagNames = article.tagInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
  
      // Case-sensitive deduplication
      const uniqueTags = [...new Set(tagNames)]
  
      // Find/create tags with original casing
      const tagPromises = uniqueTags.map(async tagName => {
        const existingTag = existingTags.find(t => 
          t.name.localeCompare(tagName, undefined, { sensitivity: 'accent' }) === 0
        )
        
        return existingTag || createTag({ name: tagName })
      })
  
      const resolvedTags = await Promise.all(tagPromises)
  
      // Create relationships
      await Promise.all(
        resolvedTags.map(tag => 
          createArticleTag({
            articleId: newArticle.id,
            tagId: tag.id
          })
        )
      )
  
      navigate('/articles')
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit article')
    }
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
            value={article.tagInput}
            onChange={(e) => setArticle({...article, tagInput: e.target.value})}
            placeholder="e.g. inference, neuroscience, llm"
          />
          <div className="tag-suggestions">
            Existing tags: {existingTags.map(t => t.name).join(', ')}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Publish Article
        </button>
      </form>
    </div>
  )
}
