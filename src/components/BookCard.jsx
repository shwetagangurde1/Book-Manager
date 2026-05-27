// src/components/BookCard.jsx
import { Pencil, Trash2, BookOpen, User, Calendar } from 'lucide-react'
import { GENRE_COLORS } from '../constants'

export default function BookCard({ book, onEdit, onDelete }) {
  const genreColor = GENRE_COLORS[book.genre] || GENRE_COLORS['Other']
  const displayYear = book.publicationYear || book.year || '—'

  return (
    <div className="card p-6 flex flex-col gap-4 group relative">
      {/* Genre Badge */}
      <div className="flex items-start justify-between">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${genreColor}`}>
          {book.genre || 'Unknown'}
        </span>

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
         <button
  onClick={() => onDelete(book)}   // Make sure it's passing the full book object
  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
>
  <Trash2 size={18} />
</button>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-start gap-3">
        <BookOpen size={20} className="text-indigo-600 mt-0.5 shrink-0" />
        <h3 className="font-semibold text-lg leading-tight text-gray-900">
          {book.title}
        </h3>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 text-gray-600">
        <User size={18} className="shrink-0" />
        <span>{book.author}</span>
      </div>

      {/* Year */}
      <div className="flex items-center gap-3 text-gray-500 mt-auto pt-4 border-t border-gray-100">
        <Calendar size={18} className="shrink-0" />
        <span className="font-medium">{displayYear}</span>
      </div>
    </div>
  )
}