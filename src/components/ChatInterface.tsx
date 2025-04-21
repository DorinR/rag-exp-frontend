import { ChatBubbleIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { Avatar, Box, Button, Flex, Heading, ScrollArea, TextArea } from '@radix-ui/themes';
import { useState } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading = false }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Flex direction="column" height="100%" p="4">
      <Flex align="center" gap="2" mb="4">
        <ChatBubbleIcon width={24} height={24} />
        <Heading size="4">Chat with your documents</Heading>
      </Flex>

      <ScrollArea
        type="hover"
        scrollbars="vertical"
        style={{
          flexGrow: 1,
          height: 'calc(100% - 130px)',
        }}
      >
        <Flex direction="column" gap="4" pb="4">
          {messages.length === 0 ? (
            <Box
              style={{
                textAlign: 'center',
                padding: 'var(--space-9)',
                color: 'var(--gray-9)',
              }}
            >
              Ask questions about your documents
            </Box>
          ) : (
            messages.map(message => (
              <Flex
                key={message.id}
                direction="column"
                p="3"
                style={{
                  borderRadius: 'var(--radius-3)',
                  backgroundColor: message.sender === 'user' ? 'var(--accent-3)' : 'var(--gray-3)',
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <Flex align="center" gap="2" mb="1">
                  <Avatar
                    size="1"
                    src={message.sender === 'user' ? undefined : '/ai-avatar.png'}
                    fallback={message.sender === 'user' ? 'U' : 'AI'}
                    color={message.sender === 'user' ? 'indigo' : 'cyan'}
                  />
                  <Box style={{ fontSize: 'var(--font-size-1)', color: 'var(--gray-11)' }}>
                    {message.sender === 'user' ? 'You' : 'AI Assistant'}
                  </Box>
                  <Box
                    style={{
                      fontSize: 'var(--font-size-1)',
                      color: 'var(--gray-8)',
                      marginLeft: 'auto',
                    }}
                  >
                    {message.timestamp}
                  </Box>
                </Flex>
                <Box style={{ whiteSpace: 'pre-wrap' }}>{message.text}</Box>
              </Flex>
            ))
          )}
          {isLoading && (
            <Flex
              direction="column"
              p="3"
              style={{
                borderRadius: 'var(--radius-3)',
                backgroundColor: 'var(--gray-3)',
                alignSelf: 'flex-start',
                maxWidth: '80%',
              }}
            >
              <Flex align="center" gap="2" mb="1">
                <Avatar size="1" src="/ai-avatar.png" fallback="AI" color="cyan" />
                <Box style={{ fontSize: 'var(--font-size-1)', color: 'var(--gray-11)' }}>
                  AI Assistant
                </Box>
                <Box
                  style={{
                    fontSize: 'var(--font-size-1)',
                    color: 'var(--gray-8)',
                    marginLeft: 'auto',
                  }}
                >
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Box>
              </Flex>
              <Box style={{ whiteSpace: 'pre-wrap' }}>Thinking...</Box>
            </Flex>
          )}
        </Flex>
      </ScrollArea>

      <Flex
        gap="2"
        style={{ position: 'sticky', bottom: 0, backgroundColor: 'var(--color-background)' }}
      >
        <TextArea
          placeholder="Ask a question about your documents..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          size="3"
          style={{ flexGrow: 1, resize: 'none' }}
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          variant="solid"
          color="indigo"
          size="3"
        >
          <PaperPlaneIcon />
          Send
        </Button>
      </Flex>
    </Flex>
  );
}
