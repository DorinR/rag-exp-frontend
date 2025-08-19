import { useMutation } from '@tanstack/react-query';
import { backendAccessPoint } from '../backendAccessPoint';

// Types to match backend request/response
export interface QueryRequest {
    query: string;
    conversationId: string;
    limit?: number;
}

export interface QueryAllConversationsRequest {
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
 * Low-level function to make API call to the conversation-scoped query endpoint
 */
const sendChatMessage = async (request: QueryRequest): Promise<ChatResponse> => {
    const response = await backendAccessPoint.post<ChatResponse>('/api/query/query', request);
    return response.data;
};

/**
 * Low-level function to query across all user's conversations
 */
const queryAllConversations = async (
    request: QueryAllConversationsRequest
): Promise<ChatResponse> => {
    const response = await backendAccessPoint.post<ChatResponse>(
        '/api/query/query-all-conversations',
        request
    );
    return response.data;
};

/**
 * Hook that uses TanStack Query's useMutation to handle conversation-scoped chat API calls
 */
export const useSendChatMessage = () => {
    return useMutation({
        mutationFn: sendChatMessage,
        onError: error => {
            console.error('Error sending chat message:', error);
        },
    });
};

/**
 * Hook that uses TanStack Query's useMutation to query across all conversations
 */
export const useQueryAllConversations = () => {
    return useMutation({
        mutationFn: queryAllConversations,
        onError: error => {
            console.error('Error querying all conversations:', error);
        },
    });
};
