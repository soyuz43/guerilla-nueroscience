// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { Home } from './Home'
import { ArticleList } from './ArticleList'
import { ArticleForm } from './ArticleForm'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { ArticleDetail } from './ArticleDetail' // Add this import

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<ArticleList />} />
        {/* Add dynamic route */}
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/submit" element={<ArticleForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App