import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ConversationMessage } from '../../types/conversation';
import { backendAccessPoint } from '../backendAccessPoint';

// Enum values should match the backend C# enum
export enum MessageRole {
    User = 0,
    Assistant = 1,
    System = 2,
}

export interface SendMessageRequest {
    content: string;
    role: MessageRole;
}

export interface SendMessageResponse {
    id: string;
    text: string;
    role: 'User' | 'Assistant' | 'System';
    timestamp: string;
    conversationId: string;
}

/**
 * Sends a message to a specific conversation
 */
export const sendMessage = async (
    conversationId: string,
    data: SendMessageRequest
): Promise<SendMessageResponse> => {
    const response = await backendAccessPoint.post<SendMessageResponse>(
        `/api/conversations/${conversationId}/message`,
        data
    );
    return response.data;
};

/**
 * Helper function to convert string role to enum value
 */
export const getRoleEnumValue = (role: 'User' | 'Assistant' | 'System'): MessageRole => {
    switch (role) {
        case 'User':
            return MessageRole.User;
        case 'Assistant':
            return MessageRole.Assistant;
        case 'System':
            return MessageRole.System;
        default:
            return MessageRole.User;
    }
};

/**
 * Hook that uses TanStack Query's useMutation to handle sending messages
 */
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            data,
        }: {
            conversationId: string;
            data: SendMessageRequest;
        }) => sendMessage(conversationId, data),
        onSuccess: (_, { conversationId }) => {
            // Invalidate messages for this conversation
            queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
            // Invalidate the conversation details to update message count
            queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
        },
        onError: error => {
            console.error('Error sending message:', error);
        },
    });
};

/**
 * Fetches all messages for a specific conversation
 */
export const fetchMessages = async (conversationId: string): Promise<ConversationMessage[]> => {
    const response = await backendAccessPoint.get<ConversationMessage[]>(
        `/api/conversations/${conversationId}/message`
    );
    return response.data;
};

/**
 * Hook that uses TanStack Query to fetch messages for a conversation
 */
export const useMessages = (conversationId: string) => {
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => fetchMessages(conversationId),
        enabled: !!conversationId,
        refetchOnMount: true,
    });
};

/**
 * Deletes a specific message from a conversation
 */
export const deleteMessage = async (conversationId: string, messageId: string): Promise<void> => {
    await backendAccessPoint.delete(`/api/conversations/${conversationId}/message/${messageId}`);
};

/**
 * Hook that uses TanStack Query's useMutation to handle message deletion
 */
export const useDeleteMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            messageId,
        }: {
            conversationId: string;
            messageId: string;
        }) => deleteMessage(conversationId, messageId),
        onSuccess: (_, { conversationId }) => {
            // Invalidate messages for this conversation
            queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
            // Invalidate the conversation details to update message count
            queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
        },
        onError: error => {
            console.error('Error deleting message:', error);
        },
    });
};
