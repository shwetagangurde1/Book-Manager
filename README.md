# 📚 BookShelf — Book Management System

A full-featured CRUD app built with **React + Vite**, **TanStack Query**, **React Hook Form**, and **Tailwind CSS**, backed by a hosted **MockAPI** endpoint.

---

## ✨ Features

- **View** all books in a responsive card grid
- **Add** new books via a validated modal form
- **Edit** existing books inline
- **Delete** with a confirmation dialog
- **Search** by title or author (live filtering)
- **Filter** by genre
- **Sort** by year (newest/oldest) or alphabetically
- Loading, error, and empty states handled gracefully
- Toast notifications for all CRUD actions

---

## 🛠 Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + Vite |
| Data fetching | TanStack Query v5 |
| Forms | React Hook Form v7 |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| HTTP client | Axios |
| Mock API | MockAPI.io |
| Deployment | Vercel |

---

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/book-manager.git
cd book-manager
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up MockAPI
1. Go to [https://mockapi.io/](https://mockapi.io/) and create a free account
2. Create a new project (e.g. `book-manager`)
3. Add a resource called **`books`** with these fields:

   | Field  | Type   |
   |--------|--------|
   | title  | String |
   | author | String |
   | genre  | String |
   | year   | Number |

4. Copy the endpoint URL — it looks like:
   `https://64abc123def456.mockapi.io/api/v1/books`

### 4. Configure the API URL
```bash
cp .env.example .env
```
Open `.env` and replace the placeholder with your MockAPI URL:
```
VITE_API_URL=https://YOUR_PROJECT_ID.mockapi.io/api/v1/books
```

### 5. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 📦 Build for production
```bash
npm run build
```

---

## ☁️ Deploy to Vercel

1. Push your code to a GitHub repo
2. Go to [https://vercel.com/](https://vercel.com/) → **Add New Project** → import your repo
3. In **Environment Variables**, add:
   - Key: `VITE_API_URL`
   - Value: your MockAPI endpoint URL
4. Click **Deploy** — done! Live URL in ~60 seconds

---

## 📁 Project Structure

```
src/
├── components/
│   ├── BookCard.jsx          # Individual book card
│   ├── BookForm.jsx          # Add / Edit modal form
│   ├── DeleteConfirmDialog.jsx
│   ├── EmptyState.jsx
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   └── Toast.jsx
├── constants/
│   └── index.js              # Genres list + color map + sort options
├── hooks/
│   └── useBooks.js           # TanStack Query hooks (CRUD)
├── services/
│   └── api.js                # Axios instance + bookService
├── App.jsx                   # Main app shell + state management
├── main.jsx                  # React entry point + QueryClient setup
└── index.css                 # Tailwind + custom utility classes
```

---

## 📝 License

MIT
