import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Separator,
  Text,
} from '@radix-ui/themes';

export interface Conversation {
  id: string;
  title: string;
  date: string;
  messageCount: number;
  isActive: boolean;
}

interface ConversationsListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
}

export function ConversationsList({
  conversations,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: ConversationsListProps) {
  return (
    <Flex direction="column" height="100%" p="4" style={{ borderLeft: '1px solid var(--gray-5)' }}>
      <Heading size="4" mb="4">
        Conversations
      </Heading>

      <Button
        onClick={onNewConversation}
        variant="soft"
        color="indigo"
        style={{ width: '100%', marginBottom: 'var(--space-4)' }}
      >
        <PlusIcon />
        New Conversation
      </Button>

      <Separator size="4" my="4" />

      <ScrollArea type="hover" scrollbars="vertical" style={{ flexGrow: 1 }}>
        <Flex direction="column" gap="2">
          {conversations.length === 0 ? (
            <Box
              style={{
                textAlign: 'center',
                padding: 'var(--space-6)',
                color: 'var(--gray-9)',
              }}
            >
              No conversations yet
            </Box>
          ) : (
            conversations.map(conversation => (
              <Flex
                key={conversation.id}
                align="center"
                p="3"
                style={{
                  borderRadius: 'var(--radius-3)',
                  cursor: 'pointer',
                  backgroundColor: conversation.isActive ? 'var(--accent-3)' : 'transparent',
                  border: conversation.isActive
                    ? '1px solid var(--accent-6)'
                    : '1px solid transparent',
                }}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <Box style={{ flexGrow: 1 }}>
                  <Flex align="center" justify="between" mb="1">
                    <Text
                      size="2"
                      weight={conversation.isActive ? 'bold' : 'regular'}
                      style={{ wordBreak: 'break-word' }}
                    >
                      {conversation.title}
                    </Text>
                    <Badge size="1" color="gray">
                      {conversation.messageCount}
                    </Badge>
                  </Flex>
                  <Text size="1" color="gray">
                    {conversation.date}
                  </Text>
                </Box>
                <IconButton
                  size="1"
                  variant="ghost"
                  color="gray"
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                >
                  <Cross2Icon />
                </IconButton>
              </Flex>
            ))
          )}
        </Flex>
      </ScrollArea>
    </Flex>
  );
}
