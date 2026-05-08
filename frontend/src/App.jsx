import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Temporary home — will be replaced in Commit 11 */}
        <Route path="*" element={
          <div style={{ padding: '2rem' }}>
            <h1>AssetTrack</h1>
            <p>App is running. <a href="/login">Go to Login</a></p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
