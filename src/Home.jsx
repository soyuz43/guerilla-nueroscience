// src/views/Home.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './assets/styles/main.css'

export const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('guerilla_user')
    setIsLoggedIn(!!user)
  }, [])

  return (
    <div className="container">
      {isLoggedIn ? (
        <>
          <h1>Welcome to Guerrilla Neuroscience</h1>
          <p>A living archive for AI inference-time research</p>
          <div className="article-card">
            <h2>Getting Started</h2>
            <p>Browse existing research or contribute your own findings:</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link to="/articles" className="submit-button">Browse Articles</Link>
              <Link to="/submit" className="submit-button">Contribute Research</Link>
            </div>
          </div>
        </>
      ) : (
        <div className="auth-message">
          <h2>Please login or register to access the research archive</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/login" className="submit-button">Login</Link>
            <Link to="/register" className="submit-button">Register</Link>
          </div>
        </div>
      )}
    </div>
  )
}