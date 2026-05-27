import { AlertTriangle, Loader2 } from 'lucide-react'

export default function DeleteConfirmDialog({ book, onConfirm, onCancel, isLoading }) {
  if (!book) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 modal-enter">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Book?</h3>
            <p className="mt-1 text-sm text-gray-500">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-800">"{book.title}"</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="btn-danger flex-1">
            {isLoading && <Loader2 size={15} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
