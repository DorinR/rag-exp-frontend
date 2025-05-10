import { UploadIcon } from '@radix-ui/react-icons';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadDocument } from '../api/document/documentApi';

interface FileDropzoneProps {
  onFilesDrop: (files: File[]) => void;
}

export function FileDropzone({ onFilesDrop }: FileDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Use our mutation hook
  const { mutate: uploadDocument, isPending } = useUploadDocument();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);
      setUploadError(null);

      try {
        // Upload files one by one
        const uploadPromises = acceptedFiles.map(
          file =>
            new Promise((resolve, reject) => {
              uploadDocument(
                { file },
                {
                  onSuccess: () => resolve(file),
                  onError: error => reject(error),
                }
              );
            })
        );

        await Promise.all(uploadPromises);

        // Invalidate and refetch documents query to get the latest documents
        queryClient.invalidateQueries({ queryKey: ['documents'] });

        // Call the parent callback to update the UI
        onFilesDrop(acceptedFiles);
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadError('Failed to upload one or more files. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onFilesDrop, uploadDocument, queryClient]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    disabled: uploading,
  });

  return (
    <Flex direction="column" align="center" justify="center" py="9" gap="6" height="100vh">
      <Card
        {...getRootProps()}
        size="3"
        style={{
          width: '100%',
          maxWidth: '600px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          border: isDragActive ? '2px dashed var(--accent-9)' : '2px dashed var(--gray-6)',
          background: isDragActive ? 'var(--accent-3)' : 'var(--gray-2)',
        }}
      >
        <input {...getInputProps()} />
        <Flex direction="column" align="center" gap="6" py="9">
          <Box
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--gray-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UploadIcon width={36} height={36} />
          </Box>
          <Heading size="5" align="center">
            {uploading ? 'Uploading...' : 'Drop your PDFs here'}
          </Heading>
          <Text as="p" color="gray" align="center">
            {uploading
              ? 'Please wait while your files are being uploaded'
              : 'Drag and drop your PDF documents, or click to select files'}
          </Text>
          {uploadError && (
            <Text as="p" color="red" align="center">
              {uploadError}
            </Text>
          )}
          <Text as="p" size="1" color="gray">
            Only PDF files are accepted
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}
