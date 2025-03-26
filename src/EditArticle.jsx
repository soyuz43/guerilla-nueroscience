// src/EditArticle.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { getArticleById, updateArticle } from './services/articleService'
import { getTags, createTag, createArticleTag, getTagsForArticle, deleteArticleTag } from './services/tagService'
import './assets/styles/main.css'

export const EditArticle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('guerilla_user'))
  const [article, setArticle] = useState({
    title: '',
    content: '',
    tagInput: ''
  })
  const [existingTags, setExistingTags] = useState([])
  const [currentArticleTags, setCurrentArticleTags] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const articleData = await getArticleById(id)
        const tagsData = await getTagsForArticle(id)
        
        setArticle({
          title: articleData.title,
          content: articleData.content,
          tagInput: tagsData.map(t => t.tag.name).join(', ')
        })
        setCurrentArticleTags(tagsData)
      } finally {
        setIsLoading(false)
      }
    }

    getTags().then(tags => setExistingTags(tags))
    loadData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await updateArticle(id, {
        title: article.title,
        content: article.content,
        date: new Date().toISOString()
      })

      const newTagNames = article.tagInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const tagsToRemove = currentArticleTags.filter(
        t => !newTagNames.includes(t.tag.name)
      )
      for (const tag of tagsToRemove) {
        await deleteArticleTag(tag.id)
      }

      const existingTagNames = currentArticleTags.map(t => t.tag.name)
      const tagsToAdd = newTagNames.filter(
        t => !existingTagNames.includes(t)
      )
      
      for (const tagName of tagsToAdd) {
        let tag = existingTags.find(t => t.name === tagName)
        if (!tag) {
          tag = await createTag({ name: tagName })
          setExistingTags(prev => [...prev, tag])
        }
        await createArticleTag({
          articleId: id,
          tagId: tag.id
        })
      }

      navigate(`/articles/${id}`)
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Failed to update article')
    }
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="container">
      {isLoading ? (
        <div className="loading">Loading edit form...</div>
      ) : (
        <>
          <h1>Edit Research Article</h1>
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
                placeholder="e.g., inference, emergent-behavior"
              />
              <div className="tag-suggestions">
                Existing tags: {existingTags.map(t => t.name).join(', ')}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Save Changes
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(`/articles/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}