import { FileTextIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Separator,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteDocument } from '../api/document/deleteDocument';

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
  const queryClient = useQueryClient();
  const { mutate: deleteDocument } = useDeleteDocument();

  const handleDelete = (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation(); // Prevent document selection when clicking delete
    deleteDocument(documentId, {
      onSuccess: () => {
        // Force refetch the documents
        queryClient.invalidateQueries({
          queryKey: ['documents'],
          exact: true,
          refetchType: 'all',
        });
      },
      onError: error => {
        console.error('Failed to delete document:', error);
        // Here you could add a toast notification for error feedback
      },
    });
  };

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
                <Tooltip content="Delete document">
                  <IconButton
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={e => handleDelete(e, doc.id)}
                  >
                    <TrashIcon />
                  </IconButton>
                </Tooltip>
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
