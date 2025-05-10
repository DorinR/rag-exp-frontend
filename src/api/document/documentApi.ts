import { useMutation, useQuery } from '@tanstack/react-query';
import { backendAccessPoint } from '../backendAccessPoint';

export interface DocumentResponse {
  id: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  description: string;
}

export interface UploadDocumentResponse {
  id: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  description: string;
}

/**
 * Uploads a document to the backend
 */
export const uploadDocument = async (
  file: File,
  description: string = ''
): Promise<UploadDocumentResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', description);

  // Override the default content-type to let the browser set it with the boundary
  const response = await backendAccessPoint.post<UploadDocumentResponse>(
    '/api/Document/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * Hook that uses TanStack Query's useMutation to handle document uploads
 */
export const useUploadDocument = () => {
  return useMutation({
    mutationFn: (params: { file: File; description?: string }) =>
      uploadDocument(params.file, params.description),
    onError: error => {
      console.error('Error uploading document:', error);
    },
  });
};

/**
 * Fetches all documents from the backend
 */
export const fetchDocuments = async (): Promise<DocumentResponse[]> => {
  const response = await backendAccessPoint.get<DocumentResponse[]>('/api/Document');
  return response.data;
};

/**
 * Hook that uses TanStack Query to fetch all documents
 */
export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
    refetchOnMount: true,
  });
};
