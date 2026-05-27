import { useState } from 'react'
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from './hooks/useBooks'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import BookCard from './components/BookCard'
import BookForm from './components/BookForm'
import DeleteConfirmDialog from './components/DeleteConfirmDialog'
import EmptyState from './components/EmptyState'
import Toast from './components/Toast'
import { GENRES, SORT_OPTIONS } from './constants/index'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [bookToDelete, setBookToDelete] = useState(null)
  const [toast, setToast] = useState(null)

  const { data: books = [], isLoading, error } = useBooks()
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const deleteBook = useDeleteBook()

  // Normalize books (fix year field for old books)
  const normalizedBooks = books.map(book => ({
    ...book,
    year: book.year || book.publicationYear || ''
  }))

  const filteredBooks = normalizedBooks
    .filter(book => 
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(book => !selectedGenre || book.genre === selectedGenre)
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.year || 0) - (a.year || 0)
      if (sortBy === 'oldest') return (a.year || 0) - (b.year || 0)
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
      if (sortBy === 'author') return (a.author || '').localeCompare(b.author || '')
      return 0
    })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleAddBook = () => {
    setEditingBook(null)
    setIsFormOpen(true)
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setIsFormOpen(true)
  }

  const handleDelete = (book) => {
    setBookToDelete(book)
  }

  const handleFormSubmit = async (data) => {
  try {
    // Send publicationYear to match existing data structure
    const payload = { 
      ...data, 
      publicationYear: Number(data.publicationYear || data.year) 
    }
    
    if (editingBook) {
      await updateBook.mutateAsync({ 
        id: editingBook.id, 
        data: payload 
      })
      showToast('Book updated successfully')
    } else {
      await createBook.mutateAsync(payload)
      showToast('Book added successfully')
    }
    
    setIsFormOpen(false)
    setEditingBook(null)
  } catch (err) {
    console.error(err)
    showToast('Failed to save book. Please try again.', 'error')
  }
}
  const handleConfirmDelete = async () => {
    if (!bookToDelete?.id) return
    
    try {
      await deleteBook.mutateAsync(bookToDelete.id)
      showToast('Book deleted successfully')
      setBookToDelete(null)
    } catch (err) {
      console.error(err)
      showToast('Failed to delete book', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar totalBooks={books.length} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          
          <select 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)} 
            className="input flex-1"
          >
            <option value="">All Genres</option>
            {GENRES.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="input flex-1"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button onClick={handleAddBook} className="btn-primary whitespace-nowrap">
            + Add Book
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">Loading books...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            Error loading books. Please check your API connection.
          </div>
        ) : filteredBooks.length === 0 ? (
          <EmptyState 
            hasFilters={!!searchTerm || !!selectedGenre} 
            onAddBook={handleAddBook} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <BookForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingBook(null) }}
        onSubmit={handleFormSubmit}
        book={editingBook}
        isLoading={createBook.isPending || updateBook.isPending}
      />

      <DeleteConfirmDialog
        book={bookToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToDelete(null)}
        isLoading={deleteBook.isPending}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

export default App