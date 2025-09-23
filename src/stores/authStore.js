import { defineStore } from 'pinia'
import axios from '@/utils/api'

// 2. Enable credentials for cookies (if using)
axios.defaults.withCredentials = true

// 3. Add JWT token to all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async login(credentials) {
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await axios.post('/auth/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async register(userData) {
      try {
        const response = await axios.post('/auth/register', {
          username: userData.name,  // Ensure field names match backend
          email: userData.email,
          password: userData.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        // console.log('Registration success:', response.data) // Add this line
        return response.data
      } catch (error) {
        console.error('Full registration error:', {
          config: error.config,
          response: error.response?.data
        })
        throw error
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isOwner: (state) => state.user?.role === 'owner'
  }
})
