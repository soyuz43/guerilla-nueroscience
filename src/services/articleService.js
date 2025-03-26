// src/services/articleService.js
const API_URL = 'http://localhost:8088/articles';

export const getArticles = () => {
  return fetch(API_URL).then(res => res.json());
};

export const createArticle = (article) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(article)
  });
};

export const getArticleById = (id) => {
  return fetch(`${API_URL}/${id}`).then(res => res.json());
};

// Export the deleteArticle function
export const deleteArticle = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then(res => {
    if (!res.ok) {
      throw new Error('Failed to delete article');
    }
    return res.json();
  });
};


export const updateArticle = (id, article) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(article)
  })
}