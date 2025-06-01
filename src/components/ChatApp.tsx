import { useCallback, useEffect, useState } from 'react';
import { useSendChatMessage } from '../api/chat/chatApi';
import { DocumentResponse, useDocuments } from '../api/document/documentApi';
import { ChatInterface, Message } from './ChatInterface';
import { Conversation, ConversationsList } from './ConversationsList';
import { Document, DocumentList } from './DocumentList';
import { FileDropzone } from './FileDropzone';

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const mockConversations: Conversation[] = [];
// const mockConversations: Conversation[] = [
//   { id: 'c1', title: 'Financial Analysis', date: 'Apr 12, 2025', messageCount: 8, isActive: true },
//   {
//     id: 'c2',
//     title: 'Project Timeline Questions',
//     date: 'Apr 10, 2025',
//     messageCount: 5,
//     isActive: false,
//   },
//   {
//     id: 'c3',
//     title: 'User Feedback Summary',
//     date: 'Mar 28, 2025',
//     messageCount: 12,
//     isActive: false,
//   },
// ];

const mockMessages: Message[] = [];
// const mockMessages: Message[] = [
//   {
//     id: 'm1',
//     sender: 'user',
//     text: 'What are the main financial highlights for Q1 2023?',
//     timestamp: '10:30 AM',
//   },
//   {
//     id: 'm2',
//     sender: 'ai',
//     text: 'Based on the financial report, the main highlights for Q1 2023 include:\n\n1. Revenue increased by 15% compared to Q1 2022\n2. Operating expenses decreased by 7%\n3. Net profit margin improved to 22% from 18% last year\n4. Cash reserves increased to $8.5M\n\nWould you like me to provide more details on any specific area?',
//     timestamp: '10:31 AM',
//   },
//   {
//     id: 'm3',
//     sender: 'user',
//     text: 'Can you tell me more about the decrease in operating expenses?',
//     timestamp: '10:33 AM',
//   },
//   {
//     id: 'm4',
//     sender: 'ai',
//     text: 'The report mentions that the 7% decrease in operating expenses was primarily due to:\n\n1. Implementation of remote work policies that reduced office maintenance costs by 32%\n2. Optimization of cloud infrastructure that lowered IT costs by 15%\n3. Renegotiation of vendor contracts resulting in 9% savings\n4. Reduction in travel expenses by 40% by adopting virtual meetings\n\nThe report projects that some of these savings will continue throughout the year, potentially leading to a sustained 5-6% reduction in annual operating expenses.',
//     timestamp: '10:34 AM',
//   },
// ];

export function ChatApp() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [hasUploadedFiles, setHasUploadedFiles] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Use our chat mutation hook
    const { mutate: sendQuery, isPending } = useSendChatMessage();

    // Fetch documents from the server
    const { data: serverDocuments, isLoading: isLoadingDocuments } = useDocuments();

    // Format server documents to match our UI model
    const formatServerDocument = useCallback((doc: DocumentResponse): Document => {
        const sizeInMb = (doc.fileSize / (1024 * 1024)).toFixed(1);
        const date = new Date(doc.uploadedAt).toLocaleDateString();

        return {
            id: doc.id,
            name: doc.originalFileName,
            size: `${sizeInMb} MB`,
            date: date,
        };
    }, []);

    // Update documents when server data changes
    useEffect(() => {
        if (serverDocuments && serverDocuments.length > 0) {
            const formattedDocs = serverDocuments.map(formatServerDocument);
            setDocuments(formattedDocs);
            setHasUploadedFiles(true);
        }
    }, [serverDocuments, formatServerDocument]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleFilesDrop = useCallback((_acceptedFiles: File[]) => {
        // The files have been uploaded in the FileDropzone component
        // We'll refresh the documents list automatically through the useDocuments hook
        // Just set hasUploadedFiles to true to show the main UI
        setHasUploadedFiles(true);
    }, []);

    const handleAddNewDocument = useCallback(() => {
        // Show the dropzone to add new files
        setHasUploadedFiles(false);
    }, []);

    const handleSelectDocument = useCallback((documentId: string) => {
        // Document selection logic can be implemented here if needed
        console.log('Document selected:', documentId);
    }, []);

    const handleSendMessage = useCallback(
        (text: string) => {
            const newUserMessage: Message = {
                id: generateId(),
                text,
                sender: 'user',
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };

            setMessages(prev => [...prev, newUserMessage]);
            setIsLoading(true);

            // Call the backend API with the user's message
            sendQuery(
                { query: text },
                {
                    onSuccess: data => {
                        // Create a new AI message with the llmResponse from the backend
                        const newAiMessage: Message = {
                            id: generateId(),
                            text: data.llmResponse || "I couldn't find an answer to your question.",
                            sender: 'ai',
                            timestamp: new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        };

                        setMessages(prev => [...prev, newAiMessage]);
                        setIsLoading(false);
                    },
                    onError: error => {
                        // Handle error by showing an error message
                        const errorMessage: Message = {
                            id: generateId(),
                            text: 'Sorry, I encountered an error processing your request. Please try again.',
                            sender: 'ai',
                            timestamp: new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        };

                        setMessages(prev => [...prev, errorMessage]);
                        setIsLoading(false);
                        console.error('Error querying the API:', error);
                    },
                }
            );
        },
        [sendQuery]
    );

    const handleSelectConversation = useCallback((conversationId: string) => {
        setConversations(prev =>
            prev.map(conv => ({
                ...conv,
                isActive: conv.id === conversationId,
            }))
        );
    }, []);

    const handleNewConversation = useCallback(() => {
        const newConversation: Conversation = {
            id: generateId(),
            title: 'New Conversation',
            date: new Date().toLocaleDateString(),
            messageCount: 0,
            isActive: true,
        };

        setConversations(prev =>
            prev
                .map(conv => ({
                    ...conv,
                    isActive: false,
                }))
                .concat(newConversation)
        );

        // Clear messages for new conversation
        setMessages([]);
    }, []);

    const handleDeleteConversation = useCallback(
        (conversationId: string) => {
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));

            // If the active conversation was deleted, activate the first one if available
            if (conversations.find(conv => conv.id === conversationId)?.isActive) {
                if (conversations.length > 1) {
                    const nextConv = conversations.find(conv => conv.id !== conversationId);
                    if (nextConv) {
                        setConversations(prev =>
                            prev.map(conv => ({
                                ...conv,
                                isActive: conv.id === nextConv.id,
                            }))
                        );
                    }
                }
            }
        },
        [conversations]
    );

    // Show loading state for documents
    if (isLoadingDocuments && !hasUploadedFiles) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-6 py-9">
                <div>Loading documents...</div>
            </div>
        );
    }

    // Show dropzone if no files uploaded or user wants to add more
    if (!hasUploadedFiles) {
        return <FileDropzone onFilesDrop={handleFilesDrop} />;
    }

    const showConversationList = false;

    return (
        <div className="h-full">
            <div className="h-full">
                <div className="flex h-full">
                    {/* Left sidebar - Document List */}
                    <div className="w-[250px] border-r border-gray-200">
                        <DocumentList
                            documents={documents}
                            onSelectDocument={handleSelectDocument}
                            onAddNewDocument={handleAddNewDocument}
                        />
                    </div>

                    {/* Center - Chat Interface */}
                    <div className="flex-1">
                        <ChatInterface
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isLoading={isPending || isLoading}
                        />
                    </div>
                    {/* Right sidebar - Conversations List */}
                    {showConversationList && (
                        <div className="w-[280px] border-l border-gray-200">
                            <ConversationsList
                                conversations={conversations}
                                onSelectConversation={handleSelectConversation}
                                onNewConversation={handleNewConversation}
                                onDeleteConversation={handleDeleteConversation}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
