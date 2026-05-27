import { BookX, Plus } from 'lucide-react'

export default function EmptyState({ hasFilters, onAddBook }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <BookX size={28} className="text-gray-400" />
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold text-gray-700">No books match your filters</h3>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or genre filter</p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-700">Your bookshelf is empty</h3>
          <p className="text-sm text-gray-400 mt-1">Add your first book to get started</p>
          <button onClick={onAddBook} className="btn-primary mt-5">
            <Plus size={16} /> Add First Book
          </button>
        </>
      )}
    </div>
  )
}
