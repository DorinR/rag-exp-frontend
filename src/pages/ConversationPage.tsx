import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSendChatMessage } from '../api/chat/chatApi';
import { useConversation } from '../api/conversation/conversationApi';
import { useConversationDocuments } from '../api/document/documentApi';
import { MessageRole, useSendMessage } from '../api/message/messageApi';
import { ChatInterface, Message } from '../components/ChatInterface';
import { Document, DocumentList } from '../components/DocumentList';
import { FileDropzone } from '../components/FileDropzone';
import { ConversationMessage } from '../types/conversation';

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export function ConversationPage() {
    const { conversationId } = useParams<{ conversationId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasUploadedFiles, setHasUploadedFiles] = useState(false);

    // Hooks for data fetching
    const {
        data: conversation,
        isLoading: isLoadingConversation,
        error: conversationError,
    } = useConversation(conversationId!);
    const { data: documents, isLoading: isLoadingDocuments } = useConversationDocuments(
        conversationId!
    );

    console.log(conversation);

    // Hooks for mutations
    const { mutate: sendChatMessage } = useSendChatMessage();
    const { mutate: sendMessage } = useSendMessage();

    // Redirect if conversation doesn't exist
    if (!conversationId) {
        return <Navigate to="/" replace />;
    }

    // Convert conversation messages to chat interface format
    const convertMessagesToChat = useCallback(
        (conversationMessages: ConversationMessage[]): Message[] => {
            return conversationMessages.map(msg => ({
                id: msg.id,
                text: msg.text,
                sender: msg.role,
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            }));
        },
        []
    );

    // Convert documents to UI format
    const convertDocumentsToUI = useCallback((docs: typeof documents): Document[] => {
        if (!docs) return [];

        return docs.map(doc => {
            const sizeInMb = (doc.fileSize / (1024 * 1024)).toFixed(1);
            const date = new Date(doc.uploadedAt).toLocaleDateString();

            return {
                id: doc.id,
                name: doc.originalFileName,
                size: `${sizeInMb} MB`,
                date: date,
            };
        });
    }, []);

    // Update messages when conversation data changes
    useEffect(() => {
        if (conversation?.messages) {
            setMessages(convertMessagesToChat(conversation.messages));
        }
    }, [conversation?.messages, convertMessagesToChat]);

    // Update documents state when documents change
    useEffect(() => {
        if (documents && documents.length > 0) {
            setHasUploadedFiles(true);
        }
    }, [documents]);

    const handleFilesDrop = useCallback((_acceptedFiles: File[]) => {
        // Files are uploaded in FileDropzone component
        setHasUploadedFiles(true);
    }, []);

    const handleAddNewDocument = useCallback(() => {
        setHasUploadedFiles(false);
    }, []);

    const handleSelectDocument = useCallback((documentId: string) => {
        console.log('Document selected:', documentId);
    }, []);

    const handleSendMessage = useCallback(
        (text: string) => {
            if (!conversationId) return;

            const newUserMessage: Message = {
                id: generateId(),
                text,
                sender: 'User',
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };

            setMessages(prev => [...prev, newUserMessage]);
            setIsLoading(true);

            // First, save the user message
            sendMessage(
                {
                    conversationId,
                    data: { content: text, role: MessageRole.User },
                },
                {
                    onSuccess: () => {
                        // Then send the chat query to get AI response
                        sendChatMessage(
                            { query: text, conversationId },
                            {
                                onSuccess: data => {
                                    // Save the AI response message
                                    sendMessage(
                                        {
                                            conversationId,
                                            data: {
                                                content: data.llmResponse,
                                                role: MessageRole.Assistant,
                                            },
                                        },
                                        {
                                            onSuccess: () => {
                                                const newAiMessage: Message = {
                                                    id: generateId(),
                                                    text:
                                                        data.llmResponse ||
                                                        "I couldn't find an answer to your question.",
                                                    sender: 'Assistant',
                                                    timestamp: new Date().toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    }),
                                                };

                                                setMessages(prev => [...prev, newAiMessage]);
                                                setIsLoading(false);
                                            },
                                            onError: () => {
                                                toast.error('Failed to save AI response');
                                                setIsLoading(false);
                                            },
                                        }
                                    );
                                },
                                onError: error => {
                                    toast.error(
                                        'Sorry, I encountered an error processing your request. Please try again.'
                                    );
                                    setIsLoading(false);
                                    console.error('Error querying the API:', error);
                                },
                            }
                        );
                    },
                    onError: () => {
                        toast.error('Failed to save your message');
                        setIsLoading(false);
                    },
                }
            );
        },
        [conversationId, sendChatMessage, sendMessage]
    );

    // Loading state
    if (isLoadingConversation) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Loading conversation...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (conversationError) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <p className="mb-4 text-red-600">Failed to load conversation</p>
                    <Navigate to="/" replace />
                </div>
            </div>
        );
    }

    // No conversation found
    if (!conversation) {
        return <Navigate to="/" replace />;
    }

    // Show dropzone if no files uploaded or user wants to add more
    if (!hasUploadedFiles && !isLoadingDocuments) {
        return <FileDropzone onFilesDrop={handleFilesDrop} conversationId={conversationId} />;
    }

    const uiDocuments = convertDocumentsToUI(documents);

    return (
        <div className="flex h-full">
            {/* Documents sidebar */}
            <div className="w-[250px] border-r border-gray-200">
                <DocumentList
                    documents={uiDocuments}
                    onSelectDocument={handleSelectDocument}
                    onAddNewDocument={handleAddNewDocument}
                    isLoading={isLoadingDocuments}
                    conversationId={conversationId}
                />
            </div>

            {/* Chat interface */}
            <div className="flex-1">
                <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
