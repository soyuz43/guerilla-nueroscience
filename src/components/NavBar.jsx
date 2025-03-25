// src/components/NavBar.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../assets/styles/main.css'

export const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check auth state on mount and storage changes
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('guerilla_user')
      setIsLoggedIn(!!user)
    }
    
    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('guerilla_user')
    window.location.reload() // Force state update
  }

  return (
    <nav className="navbar">
      <div className="container">
        <ul className="nav-list">
          {isLoggedIn ? (
            <>
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/articles" className="nav-link">Articles</Link></li>
              <li><Link to="/submit" className="nav-link">Submit</Link></li>
              <li>
                <button className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link">Login</Link></li>
              <li><Link to="/register" className="nav-link">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}