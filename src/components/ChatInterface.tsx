import { ChatBubbleIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from './ui/button/Button';

export interface Message {
    id: string;
    text: string;
    sender: 'User' | 'Assistant' | 'System';
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
        <div className="flex h-full flex-col p-4">
            <div className="mb-4 flex items-center gap-2">
                <ChatBubbleIcon width={24} height={24} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Chat with your documents</h2>
            </div>
            <div
                className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 overflow-y-auto"
                style={{ height: 'calc(100% - 130px)' }}
            >
                <div className="flex flex-col gap-4 pb-4">
                    {messages.length === 0 ? (
                        <div className="py-9 text-center text-gray-500">
                            Ask questions about your documents
                        </div>
                    ) : (
                        messages.map(message => (
                            <div
                                key={message.id}
                                className={`flex max-w-[80%] flex-col rounded-lg p-3 ${
                                    message.sender === 'User'
                                        ? 'ml-auto self-end bg-blue-100'
                                        : 'self-start rounded-md border bg-slate-50'
                                }`}
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <div
                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                            message.sender === 'User'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-cyan-600 text-white'
                                        }`}
                                    >
                                        {message.sender === 'User' ? 'U' : 'AI'}
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {message.sender === 'User' ? 'You' : 'AI Assistant'}
                                    </span>
                                    <span className="ml-auto text-xs text-gray-500">
                                        {message.timestamp}
                                    </span>
                                </div>
                                <div className="whitespace-pre-wrap text-gray-900">
                                    {message.text}
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex max-w-[80%] flex-col self-start rounded-lg bg-gray-100 p-3">
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600 text-xs font-medium text-white">
                                    AI
                                </div>
                                <span className="text-xs text-gray-600">AI Assistant</span>
                                <span className="ml-auto text-xs text-gray-500">
                                    {new Date().toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap text-gray-900">Thinking...</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 flex gap-2">
                <textarea
                    placeholder="Ask a question about your documents..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="flex-1 grow resize-none rounded-lg border border-gray-300 bg-white p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    rows={1}
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    variant="primary"
                    icon={PaperPlaneIcon}
                    iconPosition="left"
                >
                    Send
                </Button>
            </div>
        </div>
    );
}
