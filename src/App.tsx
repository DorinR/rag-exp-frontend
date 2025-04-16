import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Box, Button, Card, Container, Flex, Heading, IconButton, Text } from '@radix-ui/themes';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import TestPage from './pages/TestPage';
import { ThemeProvider, useTheme } from './providers/ThemeProvider';
import viteLogo from '/vite.svg';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Flex align="center" gap="2">
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
      <IconButton
        variant="soft"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        radius="full"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </Flex>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [showTestPage, setShowTestPage] = useState(false);

  if (showTestPage) {
    return (
      <ThemeProvider>
        <TestPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Container>
        <Flex direction="column" align="center" justify="center" py="9" gap="6">
          <Flex gap="8">
            <a href="https://vite.dev" target="_blank">
              <Box className="animate-pulse">
                <img src={viteLogo} width={96} height={96} alt="Vite logo" />
              </Box>
            </a>
            <a href="https://react.dev" target="_blank">
              <Box className="animate-spin">
                <img src={reactLogo} width={96} height={96} alt="React logo" />
              </Box>
            </a>
          </Flex>
          <Heading size="8" align="center">
            Vite + React + Radix UI
          </Heading>
          <Card size="3" style={{ width: '100%', maxWidth: '500px' }}>
            <Flex direction="column" gap="4">
              <Flex justify="between">
                <Button onClick={() => setCount(count => count + 1)}>count is {count}</Button>
                <ThemeToggle />
              </Flex>
              <Text as="p" color="gray">
                Edit{' '}
                <code
                  style={{
                    backgroundColor: 'var(--gray-4)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  src/App.tsx
                </code>{' '}
                and save to test HMR
              </Text>
              <Box mt="2">
                <Button onClick={() => setShowTestPage(true)} variant="soft" color="indigo">
                  View Radix Themes Components
                </Button>
              </Box>
            </Flex>
          </Card>
          <Text size="2" color="gray">
            Click on the Vite and React logos to learn more
          </Text>
        </Flex>
      </Container>
    </ThemeProvider>
  );
}

export default App;
