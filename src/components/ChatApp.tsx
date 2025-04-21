import { Box, Flex, Theme } from '@radix-ui/themes';
import { useCallback, useState } from 'react';
import { useSendChatMessage } from '../api/chat/chatApi';
import { ChatInterface, Message } from './ChatInterface';
import { Conversation, ConversationsList } from './ConversationsList';
import { Document, DocumentList } from './DocumentList';
import { FileDropzone } from './FileDropzone';

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Sample data
const mockDocuments: Document[] = [
  { id: 'd1', name: 'Financial Report 2023.pdf', size: '2.4 MB', date: 'Apr 12, 2025' },
  { id: 'd2', name: 'Project Proposal.pdf', size: '1.7 MB', date: 'Apr 10, 2025' },
  { id: 'd3', name: 'User Research Study.pdf', size: '3.2 MB', date: 'Mar 28, 2025' },
];

const mockConversations: Conversation[] = [
  { id: 'c1', title: 'Financial Analysis', date: 'Apr 12, 2025', messageCount: 8, isActive: true },
  {
    id: 'c2',
    title: 'Project Timeline Questions',
    date: 'Apr 10, 2025',
    messageCount: 5,
    isActive: false,
  },
  {
    id: 'c3',
    title: 'User Feedback Summary',
    date: 'Mar 28, 2025',
    messageCount: 12,
    isActive: false,
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    sender: 'user',
    text: 'What are the main financial highlights for Q1 2023?',
    timestamp: '10:30 AM',
  },
  {
    id: 'm2',
    sender: 'ai',
    text: 'Based on the financial report, the main highlights for Q1 2023 include:\n\n1. Revenue increased by 15% compared to Q1 2022\n2. Operating expenses decreased by 7%\n3. Net profit margin improved to 22% from 18% last year\n4. Cash reserves increased to $8.5M\n\nWould you like me to provide more details on any specific area?',
    timestamp: '10:31 AM',
  },
  {
    id: 'm3',
    sender: 'user',
    text: 'Can you tell me more about the decrease in operating expenses?',
    timestamp: '10:33 AM',
  },
  {
    id: 'm4',
    sender: 'ai',
    text: 'The report mentions that the 7% decrease in operating expenses was primarily due to:\n\n1. Implementation of remote work policies that reduced office maintenance costs by 32%\n2. Optimization of cloud infrastructure that lowered IT costs by 15%\n3. Renegotiation of vendor contracts resulting in 9% savings\n4. Reduction in travel expenses by 40% by adopting virtual meetings\n\nThe report projects that some of these savings will continue throughout the year, potentially leading to a sustained 5-6% reduction in annual operating expenses.',
    timestamp: '10:34 AM',
  },
];

export function ChatApp() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>('d1');
  const [hasUploadedFiles, setHasUploadedFiles] = useState(false); // Show dropzone first
  const [isLoading, setIsLoading] = useState(false);

  // Use our chat mutation hook
  const { mutate: sendQuery, isPending } = useSendChatMessage();

  const handleFilesDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments = acceptedFiles.map(file => ({
      id: generateId(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toLocaleDateString(),
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
    setHasUploadedFiles(true);
  }, []);

  const handleAddNewDocument = useCallback(() => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll simulate it by using the FileDropzone
    setHasUploadedFiles(false);
  }, []);

  const handleSelectDocument = useCallback((documentId: string) => {
    setSelectedDocumentId(documentId);
  }, []);

  const handleSendMessage = useCallback(
    (text: string) => {
      const newUserMessage: Message = {
        id: generateId(),
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

    // In a real app, this would load the conversation messages
    // For demo purposes, we'll just use the mock messages
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

  if (!hasUploadedFiles) {
    return (
      <Theme accentColor="indigo">
        <FileDropzone onFilesDrop={handleFilesDrop} />
      </Theme>
    );
  }

  return (
    <Theme accentColor="indigo">
      <Box style={{ height: '100vh', overflow: 'hidden' }}>
        <Flex style={{ height: '100%' }}>
          {/* Left sidebar - Document List */}
          <Box style={{ width: '250px', borderRight: '1px solid var(--gray-5)' }}>
            <DocumentList
              documents={documents}
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={handleSelectDocument}
              onAddNewDocument={handleAddNewDocument}
            />
          </Box>

          {/* Center - Chat Interface */}
          <Box style={{ flexGrow: 1 }}>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isPending || isLoading}
            />
          </Box>

          {/* Right sidebar - Conversations List */}
          <Box style={{ width: '280px', borderLeft: '1px solid var(--gray-5)' }}>
            <ConversationsList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
            />
          </Box>
        </Flex>
      </Box>
    </Theme>
  );
}
