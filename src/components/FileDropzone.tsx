import { UploadIcon } from '@radix-ui/react-icons';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFilesDrop: (files: File[]) => void;
}

export function FileDropzone({ onFilesDrop }: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesDrop(acceptedFiles);
    },
    [onFilesDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <Flex direction="column" align="center" justify="center" py="9" gap="6" height="100vh">
      <Card
        {...getRootProps()}
        size="3"
        style={{
          width: '100%',
          maxWidth: '600px',
          cursor: 'pointer',
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
            Drop your PDFs here
          </Heading>
          <Text as="p" color="gray" align="center">
            Drag and drop your PDF documents, or click to select files
          </Text>
          <Text as="p" size="1" color="gray">
            Only PDF files are accepted
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}
