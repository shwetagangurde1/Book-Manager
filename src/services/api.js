import axios from 'axios'

// ─── IMPORTANT ─────────────────────────────────────────────────────────────
// Replace this with your own MockAPI base URL.
// 1. Go to https://mockapi.io/ and create a free project
// 2. Add a resource called "books" with fields:
//    title (String), author (String), genre (String), year (Number)
// 3. Copy the endpoint URL and paste it below (or set VITE_API_URL in .env)
// Example: https://64a1234abcd123.mockapi.io/api/v1/books
// ───────────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'https://YOUR_MOCKAPI_ID.mockapi.io/api/v1/books'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor for error normalisation
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)

export const bookService = {
  /** GET /books  — returns array */
  getAll: () => api.get(''),

  /** GET /books/:id */
  getById: (id) => api.get(`/${id}`),

  /** POST /books */
  create: (data) => api.post('', data),

  /** PUT /books/:id */
  update: (id, data) => api.put(`/${id}`, data),

  /** DELETE /books/:id */
  delete: (id) => api.delete(`/${id}`),
}
