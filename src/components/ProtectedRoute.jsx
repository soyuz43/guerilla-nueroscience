// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('guerilla_user')
      setIsAuthenticated(!!user)
    }
    
    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}