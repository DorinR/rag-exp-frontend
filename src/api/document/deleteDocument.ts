import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendAccessPoint } from '../backendAccessPoint';

/**
 * Deletes a document from the backend by its ID
 */
export const deleteDocument = async (id: string): Promise<void> => {
  await backendAccessPoint.delete(`/api/Document/${id}`);
};

/**
 * Hook that uses TanStack Query's useMutation to handle document deletion
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onError: error => {
      console.error('Error deleting document:', error);
    },
    onSuccess: () => {
      // Invalidate and refetch the documents query to update the UI
      queryClient.invalidateQueries({
        queryKey: ['documents'],
        exact: true,
        refetchType: 'all',
      });
    },
  });
};
