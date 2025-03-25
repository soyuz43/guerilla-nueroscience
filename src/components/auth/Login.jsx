// src/components/auth/Login.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getUserByEmail } from "../../services/userService"
import "../../assets/styles/main.css"

export const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    getUserByEmail(email).then((foundUsers) => {
      if (foundUsers.length === 1) {
        const user = foundUsers[0]
        if (user.password === password) {
          localStorage.setItem(
            "guerilla_user",
            JSON.stringify({ id: user.id })
          )
          // Trigger auth state update
          window.dispatchEvent(new Event('storage'))
          navigate("/")
        } else {
          alert("Invalid password")
        }
      } else {
        alert("Invalid login")
      }
    })
  }

  return (
    <div className="container">
      <div className="auth-container">
        <h1 className="auth-title">Guerrilla Neuroscience</h1>
        <h2 className="auth-subtitle">Sign In</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/register" className="auth-link">
            Need an account? Register here
          </Link>
        </div>
      </div>
    </div>
  )
}