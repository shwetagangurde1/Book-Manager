import axios from 'axios'

// ✅ Hardcoded for Vercel Deployment
const BASE_URL = 'https://6a16f8a41b90031f81b1cf53.mockapi.io/book-manager'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err?.message || 'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)

export const bookService = {
  getAll: () => api.get(''),
  getById: (id) => api.get(`/${id}`),
  create: (data) => api.post('', data),
  update: (id, data) => api.put(`/${id}`, data),
  delete: (id) => api.delete(`/${id}`),
}