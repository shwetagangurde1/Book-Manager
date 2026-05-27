// src/App.jsx
import { useState } from 'react';
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from './hooks/useBooks';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import BookForm from './components/BookForm';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import { SORT_OPTIONS, GENRES } from './constants';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const { data: books = [], isLoading, error } = useBooks();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  // Filter + Sort Logic
  const filteredBooks = books
    .filter(book => 
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(book => !selectedGenre || book.genre === selectedGenre)
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'oldest') return (a.year || 0) - (b.year || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      return 0;
    });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingBook) {
        await updateBook.mutateAsync({ id: editingBook.id, data });
        showToast('Book updated successfully!');
      } else {
        await createBook.mutateAsync(data);
        showToast('Book added successfully!');
      }
      setIsFormOpen(false);
      setEditingBook(null);
    } catch (err) {
      showToast('Failed to save book', 'error');
    }
  };
const handleDelete = async (book) => {
    if (!book?.id) {
      showToast('Error: Book ID not found', 'error');
      return;
    }
    try {
      await deleteBook.mutateAsync(book.id);
      showToast('Book deleted successfully!');
      setBookToDelete(null);
    } catch (err) {
      showToast('Failed to delete book', 'error');
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar totalBooks={books.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="input px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Genres</option>
            {GENRES.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button 
            onClick={handleAddBook} 
            className="btn-primary whitespace-nowrap px-6 py-3"
          >
            + Add Book
          </button>
        </div>

        {/* States */}
        {isLoading && (
          <div className="text-center py-20 text-gray-500">Loading your books...</div>
        )}
        
        {error && (
          <div className="text-center py-20 text-red-500">
            Error loading books. Please check your API connection.
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filteredBooks.length === 0 ? (
              <EmptyState 
                hasFilters={!!searchTerm || !!selectedGenre} 
                onAddBook={handleAddBook} 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredBooks.map(book => (
  <BookCard
    key={book.id}           // ← Make sure this line exists
    book={book}
    onEdit={handleEditBook}
    onDelete={setBookToDelete}
  />
))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <BookForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleFormSubmit}
        book={editingBook}
        isLoading={createBook.isPending || updateBook.isPending}
      />

    <DeleteConfirmDialog
  book={bookToDelete}
  onConfirm={() => handleDelete(bookToDelete)}   // ← Pass full book object
  onCancel={() => setBookToDelete(null)}
  isLoading={deleteBook.isPending}
/>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}