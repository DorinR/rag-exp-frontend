import { FileTextIcon, PlusIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Heading, ScrollArea, Separator, Text } from '@radix-ui/themes';

export interface Document {
  id: string;
  name: string;
  size: string;
  date: string;
}

interface DocumentListProps {
  documents: Document[];
  selectedDocumentId: string | null;
  onSelectDocument: (documentId: string) => void;
  onAddNewDocument: () => void;
}

export function DocumentList({
  documents,
  selectedDocumentId,
  onSelectDocument,
  onAddNewDocument,
}: DocumentListProps) {
  return (
    <Flex direction="column" height="100%" p="4" style={{ borderRight: '1px solid var(--gray-5)' }}>
      <Heading size="4" mb="4">
        Documents
      </Heading>
      <ScrollArea type="hover" scrollbars="vertical" style={{ height: 'calc(100% - 100px)' }}>
        <Flex direction="column" gap="2">
          {documents.map(doc => (
            <Box
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              p="3"
              style={{
                borderRadius: 'var(--radius-3)',
                cursor: 'pointer',
                backgroundColor: selectedDocumentId === doc.id ? 'var(--accent-3)' : 'transparent',
                border:
                  selectedDocumentId === doc.id
                    ? '1px solid var(--accent-6)'
                    : '1px solid transparent',
              }}
            >
              <Flex align="center" gap="2">
                <FileTextIcon width={20} height={20} />
                <Box style={{ flexGrow: 1 }}>
                  <Text size="2" weight="bold" style={{ wordBreak: 'break-word' }}>
                    {doc.name}
                  </Text>
                  <Flex justify="between">
                    <Text size="1" color="gray">
                      {doc.size}
                    </Text>
                    <Text size="1" color="gray">
                      {doc.date}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </Flex>
      </ScrollArea>
      <Separator size="4" my="4" />
      <Button onClick={onAddNewDocument} variant="soft" color="gray" style={{ width: '100%' }}>
        <PlusIcon />
        Add Document
      </Button>
    </Flex>
  );
}
