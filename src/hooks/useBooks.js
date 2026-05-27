import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookService } from '../services/api'

const QUERY_KEY = ['books']

/** Fetch all books */
export function useBooks() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: bookService.getAll,
  })
}

/** Create a new book */
export function useCreateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => bookService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

/** Update an existing book */
export function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => bookService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

/** Delete a book */
export function useDeleteBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => bookService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
