import axios from 'axios';
import React from 'react';
import { useState, useRef } from 'react';
import { FaPaperclip, FaMicrophone, FaUserCircle, FaRobot, FaDropbox, FaRegFileAlt } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';
import GDrivePicker from './GdrivePicker';
import DropboxPicker from './DropboxPicker';
import NotionPicker from './NotionPicker';
import { Calendar } from 'lucide-react';
import CalendarPopup from './CalendarPopup';
import EmailComposer from './EmailComposer';
import AccessDeniedCard from './AccessDesniedCard';
import FilePreview from './FilePreview';
import PDFPreview from './PDFPreview';
import SummaryCard from './SummaryCard';
import TextToSpeechButton from './TextToSpeechButton';

const speakText = (text: string) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // You can customize language here
  synth.speak(utterance);
};


const ChatContentKush: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string | JSX.Element }[]>([]);
  const [uploadNotification, setUploadNotification] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showGDrivePicker, setShowGDrivePicker] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string }[]>([]);
  const [showDropboxPicker, setShowDropboxPicker] = useState(false);
  const [showNotionPicker, setShowNotionPicker] = useState(false);





  const handleExternalSource = (source: string) => {
    setShowUploadMenu(false);
    if (source === 'Google Drive') {
      setShowGDrivePicker(true);
      setShowNotionPicker(false);
      setShowDropboxPicker(false);

    }
    if (source === 'Dropbox') {
      setShowDropboxPicker(true);
      setShowGDrivePicker(false);
      setShowNotionPicker(false);
    }
    if (source === 'Notion') {
      setShowNotionPicker(true);
      setShowDropboxPicker(false);
      setShowGDrivePicker(false);
    }
  };

  const parseMarkdown = (text: string) => {
    text = text.replace("**", "<strong>").replace("**", "</strong>");
    const lines = text.split('\n');
  
    return (
      <div className="whitespace-pre-wrap space-y-1">
        {lines.map((line, i) => {
          // Bullet points
          if (line.trim().startsWith('* ')) {
            const content = line.replace(/^\* /, '');
            return (
              <div key={i} className="pl-4 list-disc list-inside">
                • {content}
              </div>
            );
          }
  
          // Bold formatting
          const parts = line.split(/(\*\*[^*]+\*\*)/g).map((segment, idx) => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
              return <strong key={idx}>{segment.slice(2, -2)}</strong>;
            }
            return <span key={idx}>{segment}</span>;
          });
  
          return <div key={i}>{parts}</div>;
        })}
        <TextToSpeechButton text={text} />
      </div>
    );
  };
  


  const handleSend = async () => {
    if (!query.trim()) return;
  
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setQuery('');
  
    try {
      const response = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
      });
  
      if (!response.body) {
        console.error("No response body");
        return;
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let accumulatedContent = '';
  
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
  
        const chunkValue = decoder.decode(value);
        const events = chunkValue.split("\n\n");
  
        for (const event of events) {
          if (!event.startsWith("data: ")) continue;
          const dataStr = event.replace("data: ", "").trim();
          if (!dataStr) continue;
  
          try {
            const dataObj = JSON.parse(dataStr);
  
            if (dataObj.payload_type === 'values' && dataObj.error) {
              // 🔴 Handle error
              const errorMessage = dataObj.error;
              setMessages(prev => [...prev, {
                sender: 'bot',
                text: <AccessDeniedCard
                  resource="PDF ACCESS DENIED!!"
                  reason={errorMessage}
                  timestamp={new Date().toLocaleString()}
                />
              }]);
              return; // Stop further processing
            }
  
            if (dataObj.payload_type === 'message') {
              const {
                content,
                function_call,
                function_name,
                tool_call,
                tool_name
              } = dataObj;
  
              if (function_call) {
                let spinnerText = '';
                switch (function_name) {
                  case 'RouteQuery':
                    spinnerText = '🔍 Retrieving relevant documents...';
                    break;
                  case 'GradeDocuments':
                    spinnerText = '📊 Re-ranking the documents...';
                    break;
                  default:
                    spinnerText = `Running ${function_name}...`;
                }
  
                setMessages(prevMessages => {
                  const last = prevMessages[prevMessages.length - 1];
  
                  if (
                    last &&
                    last.sender === 'bot' &&
                    typeof last.text !== 'string' &&
                    React.isValidElement(last.text)
                  ) {
                    const updated = [...prevMessages];
                    updated[updated.length - 1] = {
                      ...last,
                      text: (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
                          <span>{spinnerText}</span>
                        </div>
                      ),
                    };
                    return updated;
                  } else {
                    return [
                      ...prevMessages,
                      {
                        sender: 'bot',
                        text: (
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
                            <span>{spinnerText}</span>
                          </div>
                        ),
                      },
                    ];
                  }
                });
              } else if (tool_call) {
                setMessages(prev => [...prev, {
                  sender: 'bot',
                  text: <div><strong>Tool:</strong> {tool_name}</div>
                }]);
              } else if (content) {
                accumulatedContent += content;
  
                setMessages(prevMessages => {
                  const updated = [...prevMessages];
                  const last = updated[updated.length - 1];
  
                  if (last && last.sender === 'bot' && typeof last.text === 'string') {
                    updated[updated.length - 1] = {
                      ...last,
                      text: accumulatedContent,
                    };
                  } else if (
                    last &&
                    last.sender === 'bot' &&
                    typeof last.text !== 'string' &&
                    React.isValidElement(last.text)
                  ) {
                    updated[updated.length - 1] = {
                      ...last,
                      text: (
                        <div>
                          <SummaryCard
                            title="Quick Summary"
                            content={parseMarkdown(accumulatedContent)}
                            timestamp={new Date().toLocaleString()}
                          />
                        </div>
                      ),
                    };
                  } else {
                    updated.push({
                      sender: 'bot',
                      text: (
                        <div>
                          {parseMarkdown(accumulatedContent)}
                          <SummaryCard
                            title="Quick Summary"
                            content={parseMarkdown(accumulatedContent)}
                            timestamp={new Date().toLocaleString()}
                          />
                        </div>
                      ),
                    });
                  }
  
                  return updated;
                });
              }
            }
  
          } catch (err) {
            console.error("Error parsing stream chunk", err);
          }
        }
      }
  
      // Final response fallback logic
      if (accumulatedContent === 'show_calendar') {
        setMessages(prev => [...prev, { sender: 'bot', text: <CalendarPopup /> }]);
      } else if (accumulatedContent === 'email_composer') {
        setMessages(prev => [...prev, { sender: 'bot', text: <EmailComposer /> }]);
      }else if (accumulatedContent === 'file_preview') {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: <FilePreview filename="test.csv" fileSize="10kb" fileType="xlsx" timestamp="April 5, 2025 – 9:42 AM" />
        }]);
      } else if (accumulatedContent === 'pdf_preview') {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: <PDFPreview filename="test.pdf" fileSize="1.2MB" timestamp="April 5, 2025 – 9:42 AM" />
        }]);
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to backend.' }]);
    }
  };
  


  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    try {
      const res = await axios.post('/api/upload-docs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = Array.from(files).map((f) => ({ id: f.name, name: f.name }));
      setUploadedFiles(prev => [...prev, ...uploaded]);

      setUploadNotification(`${files.length} file(s) uploaded successfully.`);
      setTimeout(() => setUploadNotification(null), 3000);
    } catch {
      setUploadNotification('Upload failed.');
      setTimeout(() => setUploadNotification(null), 3000);
    }
  };

  const downloadFile = async (fileId: string, accessToken: string) => {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const blob = await res.blob();
    return blob;
  };
  


  return (
    <main className="flex-1 flex flex-col h-screen relative bg-gray-50">

      {showNotionPicker && (
        <div className="absolute inset-0 bg-white z-10 overflow-auto">
          <NotionPicker
            onPageSelected={async (pages) => {
              try {
                const res = await axios.post('http://localhost:5000/upload_notion', { pages });
                if (res.status === 200) {
                  setUploadedFiles(prev => [...prev, ...pages]);
                  setMessages(prev => [...prev, { sender: 'bot', text: 'Data uploaded from Notion successfully.' }]);
                } else {
                  setMessages(prev => [...prev, { sender: 'bot', text: 'Failed to upload from Notion.' }]);
                }
              } catch {
                setMessages(prev => [...prev, { sender: 'bot', text: 'Notion upload failed.' }]);
              }
              setShowNotionPicker(false);
            }}
            onClose={() => setShowNotionPicker(false)}
          />
        </div>
      )}


      {showGDrivePicker && (
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
            <GDrivePicker
              onFilesSelected={async (selectedFiles,accessToken) => {
                const formData = new FormData();
                for (const file of selectedFiles) {
                  const blob = await downloadFile(file.id, accessToken);
                  formData.append('files', blob);
                }
              
                await axios.post('/api/upload-docs', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
              }}
            />
          </div>
        </div>
      )}

      {showDropboxPicker && (
        <div className="absolute inset-0 bg-white z-10 overflow-auto">
          <DropboxPicker
            onFilesSelected={async (files) => {
              try {
                const res = await axios.post('/api/upload-docs', { files });
                if (res.status === 200) {
                  setUploadedFiles(prev => [...prev, ...files]);
                  setMessages(prev => [...prev, { sender: 'bot', text: 'Data uploaded successfully from Dropbox.' }]);
                } else {
                  setMessages(prev => [...prev, { sender: 'bot', text: 'Failed to upload Dropbox data.' }]);
                }
              } catch {
                setMessages(prev => [...prev, { sender: 'bot', text: 'Dropbox upload failed.' }]);
              }
              setShowDropboxPicker(false);
            }}
            onClose={() => setShowDropboxPicker(false)}
          />
        </div>
      )}


      {uploadNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md z-10">
          {uploadNotification}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start max-w-xl gap-2 ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
          >
            <div className="text-2xl text-gray-600">
              {msg.sender === 'user' ? <FaUserCircle /> : <FaRobot />}
            </div>
            <div
              className={`px-4 py-2 rounded-lg shadow text-sm ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Area */}
      <div className="border-t border-gray-300 bg-white px-4 py-3 flex items-center sticky bottom-0">
        <div className="relative">
          <button
            onClick={() => setShowUploadMenu(prev => !prev)}
            className="mr-2 text-gray-600 hover:text-black text-xl"
          >
            <FaPaperclip />
          </button>

          {showUploadMenu && (
            <div className="absolute bottom-12 left-0 bg-white border border-gray-300 shadow-lg rounded-md z-20 w-52 text-sm">
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowUploadMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <FaRegFileAlt /> Upload Document
              </button>
              <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
                Use Other Sources
              </div>
              <button
                onClick={() => handleExternalSource('Google Drive')}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <FcGoogle className="text-blue-600" /> Google Drive
              </button>
              <button
                onClick={() => handleExternalSource('Dropbox')}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <FaDropbox className="text-indigo-600" /> Dropbox
              </button>
              <button
                onClick={() => handleExternalSource('Notion')}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <SiNotion className="text-black" /> Notion
              </button>
            </div>
          )}

          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question or give instructions..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2 focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <button
          onClick={handleVoiceInput}
          className={`mr-2 px-3 py-2 rounded text-xl ${listening ? 'bg-red-100' : 'bg-gray-200'
            } hover:bg-gray-300`}
        >
          <FaMicrophone />
        </button>

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </main>
  );
};

export default ChatContentKush;
