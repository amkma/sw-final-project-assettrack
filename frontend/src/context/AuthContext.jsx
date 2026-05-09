import { createContext, useState, useEffect, useCallback } from 'react'
import API from '../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await API.post('/auth/login', { email, password })
    const { token: newToken, user: baseUser } = response.data

    // Set token immediately so subsequent API calls in this flow are authenticated
    localStorage.setItem('token', newToken)

    let fullUser = { ...baseUser }
    try {
      const profileRes = await API.get(`/users/${baseUser.id}`)
      fullUser = { ...fullUser, ...profileRes.data }
    } catch (err) {
      console.warn('Could not fetch full profile:', err)
    }

    const { ROLE_STRING_TO_ID } = await import('../utils/constants')

    const finalUser = {
      ...fullUser,
      roleId: ROLE_STRING_TO_ID[baseUser.role] ?? 0,
    }

    localStorage.setItem('user', JSON.stringify(finalUser))
    setToken(newToken)
    setUser(finalUser)

    return finalUser
  }, [])

  const signup = useCallback(async (firstName, lastName, email, password) => {
    const response = await API.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    })
    return response.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  // Demo login — sets mock user data without calling the API
  const demoLogin = useCallback((mockUser) => {
    const fakeToken = 'demo-token-' + Date.now()
    localStorage.setItem('token', fakeToken)
    localStorage.setItem('user', JSON.stringify(mockUser))
    setToken(fakeToken)
    setUser(mockUser)
  }, [])

  const isAuthenticated = !!token

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    demoLogin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
