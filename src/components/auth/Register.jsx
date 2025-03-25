// src/components/auth/Register.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUser, getUserByEmail } from "../../services/userService"
import "../../assets/styles/main.css"

export const Register = () => {
  const [user, setUser] = useState({
    email: "",
    fullName: "",
    password: "",
  })
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()
    
    getUserByEmail(user.email).then((users) => {
      if (users.length > 0) {
        alert("Account with that email already exists")
      } else {
        createUser(user).then((createdUser) => {
          if (createdUser.id) {
            localStorage.setItem(
              "guerilla_user",
              JSON.stringify({ id: createdUser.id })
            )
            // Trigger auth state update
            window.dispatchEvent(new Event('storage'))
            navigate("/")
          }
        })
      }
    })
  }

  const updateUser = (e) => {
    const { id, value } = e.target
    setUser(prev => ({ ...prev, [id]: value }))
  }

  return (
    <div className="container">
      <div className="auth-container">
        <h1 className="auth-title">Guerrilla Neuroscience</h1>
        <h2 className="auth-subtitle">Create Account</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              id="fullName"
              className="input-field"
              onChange={updateUser}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              onChange={updateUser}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              onChange={updateUser}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/login" className="auth-link">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}