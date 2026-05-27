import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => onDismiss(), 3500)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
        ${isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
        {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
        <span>{toast.message}</span>
        <button onClick={onDismiss} className="ml-2 opacity-75 hover:opacity-100">
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
