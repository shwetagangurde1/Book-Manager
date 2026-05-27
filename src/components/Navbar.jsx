import { BookMarked } from 'lucide-react'

export default function Navbar({ totalBooks }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow">
            <BookMarked size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">BookShelf</h1>
            <p className="text-xs text-gray-400 leading-tight hidden sm:block">Book Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
          <span className="text-xs font-medium text-indigo-600">
            {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
          </span>
        </div>
      </div>
    </header>
  )
}
