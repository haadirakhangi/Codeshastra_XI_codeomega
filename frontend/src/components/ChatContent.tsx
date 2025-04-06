import axios from 'axios';
import { useState, useRef } from 'react';
import { FaPaperclip, FaMicrophone, FaUserCircle, FaRobot, FaDropbox, FaRegFileAlt, FaFileAlt } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';
import GDrivePicker from './GDrivePicker';
import DropboxPicker from './DropboxPicker';
import NotionPicker from './NotionPicker';
import { motion } from 'framer-motion';

interface ChatContentProps {
  onDocumentClick?: () => void;
  documentTitle?: string;
  showDocumentBox?: boolean;
}

const ChatContent: React.FC<ChatContentProps> = ({
  onDocumentClick,
  documentTitle = "Design: The Differentiator Your Brand Can't Ignore",
  showDocumentBox = false
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
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

  const handleSend = async () => {
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setQuery('');
    setResponse(null);

    try {
      const res = await axios.post('/api/agent-chat', { query });
      const reply = res.data?.response || 'No response from backend.';
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'No response from backend.' }]);
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
              onFilesSelected={async (files) => {
                try {
                  const res = await axios.post('/api/upload_gdrive', { files });
                  if (res.status === 200) {
                    setUploadedFiles(prev => [...prev, ...files]);
                    setMessages(prev => [
                      ...prev,
                      { sender: 'bot', text: `Data uploaded successfully from Google Drive.` }
                    ]);
                  } else {
                    setMessages(prev => [
                      ...prev,
                      { sender: 'bot', text: `Failed to upload data from Google Drive.` }
                    ]);
                  }
                } catch {
                  setMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: `Failed to upload data from Google Drive.` }
                  ]);
                }
                setShowGDrivePicker(false);
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
                const res = await axios.post('http://localhost:5000/upload_dropbox', { files });
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
        {/* Document Box - Appears when Canvas is closed */}
        {showDocumentBox && (
          <motion.div
            className="mb-4 cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onDocumentClick}
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-blue-500 text-xl" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{documentTitle}</h3>
                  <p className="text-sm text-gray-500">Click to open document</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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

export default ChatContent;
