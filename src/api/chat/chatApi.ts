import { useMutation } from '@tanstack/react-query';
import { backendAccessPoint } from '../backendAccessPoint';

// Types to match backend request/response
export interface QueryRequest {
  query: string;
  limit?: number;
}

export interface RetrievedChunk {
  text: string;
  documentId: string;
  documentTitle: string;
  similarity: number;
}

export interface ChatResponse {
  originalQuery: string;
  processedQuery: string;
  llmResponse: string;
  retrievedChunks: RetrievedChunk[];
}

/**
 * Low-level function to make API call to the query endpoint
 */
const sendChatMessage = async (request: QueryRequest): Promise<ChatResponse> => {
  const response = await backendAccessPoint.post<ChatResponse>('/api/rag/query', request);
  return response.data;
};

/**
 * Hook that uses TanStack Query's useMutation to handle chat API calls
 */
export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: sendChatMessage,
    onError: error => {
      console.error('Error sending chat message:', error);
    },
  });
};
