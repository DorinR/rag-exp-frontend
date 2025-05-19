import { FileTextIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
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

  const handleDelete = (documentId: string) => {
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
                <AlertDialog.Root>
                  <Tooltip content="Delete document">
                    <AlertDialog.Trigger>
                      <IconButton
                        size="1"
                        variant="ghost"
                        color="gray"
                        onClick={e => e.stopPropagation()}
                      >
                        <TrashIcon />
                      </IconButton>
                    </AlertDialog.Trigger>
                  </Tooltip>

                  <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>
                      <Heading as="h3" size="4">
                        Delete Document
                      </Heading>
                    </AlertDialog.Title>
                    <AlertDialog.Description>
                      <Text as="p" size="2" color="gray" mb="4">
                        Are you sure you want to delete "{doc.name}"? This action cannot be undone.
                      </Text>
                    </AlertDialog.Description>

                    <Flex gap="3" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button
                          variant="solid"
                          color="red"
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(doc.id);
                          }}
                        >
                          Delete
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
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
