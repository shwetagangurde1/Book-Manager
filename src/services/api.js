import axios from 'axios'

// ✅ Correct MockAPI URL (this one actually has your data)
const BASE_URL = 'https://6a171b961b90031f81b20bbc.mockapi.io/api/v1/books'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('API Error:', err.response?.status, err.config?.url)
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