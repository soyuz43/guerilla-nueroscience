// src/services/userService.js
const API_URL = "http://localhost:8088/users"

// Add explicit exports
export const createUser = (userData) => {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData)
  }).then(res => res.json())
}

export const getUserByEmail = (email) => {
  return fetch(`${API_URL}?email=${email}`)
    .then(res => res.json())
}