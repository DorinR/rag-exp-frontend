import { ChatApp } from './components/ChatApp';
import { ThemeProvider } from './providers/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <ChatApp />
    </ThemeProvider>
  );
}

export default App;
