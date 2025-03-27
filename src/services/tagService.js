// src/services/tagService.js
const API_URL = 'http://localhost:8088'

export const getTags = () => {
  return fetch(`${API_URL}/tags`).then(res => res.json())
}

export const createTag = (tag) => {
  return fetch(`${API_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tag)
  }).then(res => res.json())
}

export const createArticleTag = (articleTag) => {
    return fetch('http://localhost:8088/articleTags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        articleId: articleTag.articleId,
        tagId: articleTag.tagId
      })
    }).then(res => res.json());
};

export const getTagsForArticle = (articleId) => {
  return fetch(`${API_URL}/articleTags?articleId=${articleId}&_expand=tag`)
    .then(res => res.json())
}

export const deleteArticleTag = (id) => {
    return fetch(`${API_URL}/articleTags/${id}`, {
      method: 'DELETE'
    }).then(res => {
      if (!res.ok) {
        throw new Error('Failed to delete article tag')
      }
      return res.json()
    })
  }

export const getAllTags = () => {
    return fetch('http://localhost:8088/tags')
      .then(res => res.json())
}



// New function to delete all articleTags by articleId
export const deleteArticleTagsByArticleId = async (articleId) => {
  // Fetch all articleTag relationships for the article
  const articleTags = await fetch(`${API_URL}/articleTags?articleId=${articleId}`)
    .then(res => res.json())
  
  // Delete each relationship and return the promises
  return Promise.all(articleTags.map(rel => deleteArticleTag(rel.id)))
}