import { Pencil, Trash2, BookOpen, User, Calendar } from 'lucide-react'
import { GENRE_COLORS } from '../constants'

export default function BookCard({ book, onEdit, onDelete }) {
  const genreColor = GENRE_COLORS[book.genre] || GENRE_COLORS['Other']

  return (
    <div className="card p-5 flex flex-col gap-3 group">
      {/* Genre badge */}
      <div className="flex items-start justify-between gap-2">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${genreColor}`}>
          {book.genre || 'Unknown'}
        </span>
        {/* Actions — visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(book)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Edit book"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(book)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete book"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-start gap-2">
        <BookOpen size={16} className="text-indigo-500 mt-0.5 shrink-0" />
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {book.title}
        </h3>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <User size={14} className="shrink-0" />
        <span className="truncate">{book.author}</span>
      </div>

      {/* Year */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mt-auto pt-2 border-t border-gray-100">
        <Calendar size={13} className="shrink-0" />
        <span>{book.year || '—'}</span>
      </div>
    </div>
  )
}
