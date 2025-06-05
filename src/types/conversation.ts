export interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationWithDetails extends Conversation {
    documents: ConversationDocument[];
    messages: ConversationMessage[];
}

export interface ConversationDocument {
    id: string;
    originalFileName: string;
    contentType: string;
    fileSize: number;
    uploadedAt: string;
    description: string;
    conversationId: string;
}

export interface CreateConversationRequest {
    title?: string;
}

export interface UpdateConversationRequest {
    title: string;
}

export interface ConversationMessage {
    id: string;
    text: string;
    role: 'User' | 'Assistant' | 'System';
    timestamp: string;
    conversationId: string;
}
