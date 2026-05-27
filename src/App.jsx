import { useState, useMemo, useCallback } from 'react'
import { Plus, Filter, RefreshCw, Loader2, AlertCircle } from 'lucide-react'

import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from './hooks/useBooks'
import { GENRES, SORT_OPTIONS } from './constants'

import Navbar from './components/Navbar'
import BookCard from './components/BookCard'
import BookForm from './components/BookForm'
import DeleteConfirmDialog from './components/DeleteConfirmDialog'
import SearchBar from './components/SearchBar'
import EmptyState from './components/EmptyState'
import Toast from './components/Toast'

export default function App() {
  // ── Data ────────────────────────────────────────────────────────────────
  const { data: books = [], isLoading, isError, error, refetch } = useBooks()
  const createMutation = useCreateBook()
  const updateMutation = useUpdateBook()
  const deleteMutation = useDeleteBook()

  // ── UI State ─────────────────────────────────────────────────────────────
  const [formOpen, setFormOpen]       = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [deletingBook, setDeletingBook] = useState(null)
  const [search, setSearch]           = useState('')
  const [genreFilter, setGenreFilter] = useState('all')
  const [sortBy, setSortBy]           = useState('newest')
  const [toast, setToast]             = useState(null)

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => setToast({ message, type })

  const openAdd = () => { setEditingBook(null); setFormOpen(true) }
  const openEdit = (book) => { setEditingBook(book); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditingBook(null) }

  // ── Filtered + Sorted Books ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...books]

    // Search
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q),
      )
    }

    // Genre
    if (genreFilter !== 'all') {
      list = list.filter((b) => b.genre === genreFilter)
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'newest') return (b.year || 0) - (a.year || 0)
      if (sortBy === 'oldest') return (a.year || 0) - (b.year || 0)
      if (sortBy === 'title')  return (a.title || '').localeCompare(b.title || '')
      if (sortBy === 'author') return (a.author || '').localeCompare(b.author || '')
      return 0
    })

    return list
  }, [books, search, genreFilter, sortBy])

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleFormSubmit = useCallback(
    async (data) => {
      try {
        if (editingBook) {
          await updateMutation.mutateAsync({ id: editingBook.id, data })
          showToast('Book updated successfully!')
        } else {
          await createMutation.mutateAsync(data)
          showToast('Book added successfully!')
        }
        closeForm()
      } catch (err) {
        showToast(err.message, 'error')
      }
    },
    [editingBook, createMutation, updateMutation],
  )

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(deletingBook.id)
      showToast('Book deleted.')
      setDeletingBook(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }, [deletingBook, deleteMutation])

  const hasFilters = search.trim() !== '' || genreFilter !== 'all'
  const isMutating = createMutation.isPending || updateMutation.isPending

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar totalBooks={books.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Genre filter */}
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400 shrink-0" />
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="input w-40 bg-white text-sm"
            >
              <option value="all">All Genres</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-40 bg-white text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Add button */}
          <button onClick={openAdd} className="btn-primary shrink-0">
            <Plus size={16} /> Add Book
          </button>
        </div>

        {/* ── Results count ── */}
        {!isLoading && !isError && books.length > 0 && (
          <p className="text-sm text-gray-400 mb-4">
            Showing <span className="font-medium text-gray-700">{filtered.length}</span> of{' '}
            <span className="font-medium text-gray-700">{books.length}</span> books
          </p>
        )}

        {/* ── Loading state ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
            <p className="text-sm text-gray-500">Loading your books…</p>
          </div>
        )}

        {/* ── Error state ── */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertCircle size={26} className="text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">Failed to load books</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                {error?.message || 'Could not connect to the API. Check your VITE_API_URL.'}
              </p>
            </div>
            <button onClick={() => refetch()} className="btn-secondary gap-2">
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState hasFilters={hasFilters} onAddBook={openAdd} />
        )}

        {/* ── Book grid ── */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={openEdit}
                onDelete={(b) => setDeletingBook(b)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      <BookForm
        isOpen={formOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        book={editingBook}
        isLoading={isMutating}
      />

      <DeleteConfirmDialog
        book={deletingBook}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingBook(null)}
        isLoading={deleteMutation.isPending}
      />

      {/* ── Toast ── */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
