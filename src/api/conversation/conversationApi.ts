import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Conversation,
    ConversationWithDetails,
    CreateConversationRequest,
    UpdateConversationRequest,
} from '../../types/conversation';
import { backendAccessPoint } from '../backendAccessPoint';

/**
 * Creates a new conversation
 */
export const createConversation = async (
    data: CreateConversationRequest = {}
): Promise<Conversation> => {
    const response = await backendAccessPoint.post<Conversation>('/api/conversation', data);
    return response.data;
};

/**
 * Hook that uses TanStack Query's useMutation to handle conversation creation
 */
export const useCreateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createConversation,
        onSuccess: () => {
            // Invalidate conversations list to refetch
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        onError: error => {
            console.error('Error creating conversation:', error);
        },
    });
};

/**
 * Fetches all conversations for the current user
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
    const response = await backendAccessPoint.get<Conversation[]>('/api/conversation');
    return response.data;
};

/**
 * Hook that uses TanStack Query to fetch all conversations
 */
export const useConversations = () => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: fetchConversations,
        refetchOnMount: true,
    });
};

/**
 * Fetches a specific conversation with its documents and messages
 */
export const fetchConversationById = async (
    conversationId: string
): Promise<ConversationWithDetails> => {
    const response = await backendAccessPoint.get<ConversationWithDetails>(
        `/api/conversation/${conversationId}`
    );
    return response.data;
};

/**
 * Hook that uses TanStack Query to fetch a specific conversation
 */
export const useConversation = (conversationId: string) => {
    return useQuery({
        queryKey: ['conversation', conversationId],
        queryFn: () => fetchConversationById(conversationId),
        enabled: !!conversationId,
        refetchOnMount: true,
    });
};

/**
 * Updates a conversation's title
 */
export const updateConversation = async (
    conversationId: string,
    data: UpdateConversationRequest
): Promise<Conversation> => {
    const response = await backendAccessPoint.put<Conversation>(
        `/api/conversation/${conversationId}`,
        data
    );
    return response.data;
};

/**
 * Hook that uses TanStack Query's useMutation to handle conversation updates
 */
export const useUpdateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            data,
        }: {
            conversationId: string;
            data: UpdateConversationRequest;
        }) => updateConversation(conversationId, data),
        onSuccess: updatedConversation => {
            // Update the conversations list cache
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            // Update the specific conversation cache
            queryClient.invalidateQueries({ queryKey: ['conversation', updatedConversation.id] });
        },
        onError: error => {
            console.error('Error updating conversation:', error);
        },
    });
};

/**
 * Deletes a conversation and all its associated data
 */
export const deleteConversation = async (conversationId: string): Promise<void> => {
    await backendAccessPoint.delete(`/api/conversation/${conversationId}`);
};

/**
 * Hook that uses TanStack Query's useMutation to handle conversation deletion
 */
export const useDeleteConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteConversation,
        onSuccess: () => {
            // Invalidate conversations list to refetch
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        onError: error => {
            console.error('Error deleting conversation:', error);
        },
    });
};
