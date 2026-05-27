import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Loader2 } from 'lucide-react'
import { GENRES } from '../constants'

const currentYear = new Date().getFullYear()

export default function BookForm({ isOpen, onClose, onSubmit, book, isLoading }) {
  const isEditing = Boolean(book)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      year: '',
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (book) {
      reset({ title: book.title, author: book.author, genre: book.genre, year: book.year })
    } else {
      reset({ title: '', author: '', genre: '', year: '' })
    }
  }, [book, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="label">Title <span className="text-red-500">*</span></label>
            <input
              className={`input ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="e.g. The Great Gatsby"
              {...register('title', { required: 'Title is required', maxLength: { value: 200, message: 'Too long' } })}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Author */}
          <div>
            <label className="label">Author <span className="text-red-500">*</span></label>
            <input
              className={`input ${errors.author ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="e.g. F. Scott Fitzgerald"
              {...register('author', { required: 'Author is required' })}
            />
            {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>}
          </div>

          {/* Genre */}
          <div>
            <label className="label">Genre <span className="text-red-500">*</span></label>
            <select
              className={`input bg-white ${errors.genre ? 'border-red-400 focus:ring-red-400' : ''}`}
              {...register('genre', { required: 'Genre is required' })}
            >
              <option value="">Select a genre…</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.genre && <p className="mt-1 text-xs text-red-500">{errors.genre.message}</p>}
          </div>

          {/* Year */}
          <div>
            <label className="label">Publication Year <span className="text-red-500">*</span></label>
            <input
              type="number"
              className={`input ${errors.year ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="e.g. 1925"
              {...register('year', {
                required: 'Year is required',
                min: { value: 1, message: 'Enter a valid year' },
                max: { value: currentYear, message: `Year can't be in the future` },
                valueAsNumber: true,
              })}
            />
            {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year.message}</p>}
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={handleClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
