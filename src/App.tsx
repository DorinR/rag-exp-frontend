import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { cn } from './utils/cn';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-center py-2',
        darkMode ? 'bg-gray-900' : 'bg-gray-100'
      )}
    >
      <div className="flex gap-20">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-24 w-24 animate-pulse" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24 w-24 animate-spin" alt="React logo" />
        </a>
      </div>
      <h1 className={cn('mt-6 text-4xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
        Vite + React + Tailwind
      </h1>
      <div
        className={cn(
          'mt-6 rounded-xl border p-6 shadow-md',
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}
      >
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setCount(count => count + 1)}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            count is {count}
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <p className={cn('mt-4', darkMode ? 'text-gray-300' : 'text-gray-700')}>
          Edit{' '}
          <code
            className={cn(
              'rounded p-1 font-mono text-sm',
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            )}
          >
            src/App.tsx
          </code>{' '}
          and save to test HMR
        </p>
      </div>
      <p className={cn('mt-6 text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
