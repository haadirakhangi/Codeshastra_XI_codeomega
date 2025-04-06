import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type ChatNodeProps = {
  data: {
    messages: Message[];
    onSendMessage: (text: string) => void;
  };
};

export function ChatNode({ data }: ChatNodeProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      data.onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-5 border border-gray-200 w-[450px] min-h-[500px] flex flex-col overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 rounded-full border-2 border-primary bg-white left-[-6px]"
      />

      <div className="flex items-center justify-between mb-4 overflow-x-auto">
        <div className="flex items-center gap-3">
          <div className="bg-primary bg-opacity-10 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-primary">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span className="font-semibold text-lg">AI Assistant</span>
        </div>
      </div>

      <div className="flex-1 mb-4 overflow-auto pr-2 max-h-[400px]">
        <div className="flex flex-col gap-4">
          {data.messages.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-10">
              <div className="mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="mx-auto text-gray-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <p className="font-medium">Connect documents to me and ask questions</p>
              <p className="text-xs mt-1">I'll help you analyze them!</p>
            </div>
          ) : (
            data.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  } px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow`}
                >
                  <p>{message.text}</p>
                  <p className="text-[10px] opacity-70 mt-1 text-right">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask something about your documents..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-opacity-90 disabled:opacity-50"
          disabled={!inputValue.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}
