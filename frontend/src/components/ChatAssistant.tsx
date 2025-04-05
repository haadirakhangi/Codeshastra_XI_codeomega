import React, { useState } from 'react';

const MainContent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; progress: number }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // ✅ Store uploaded files
  const [uploadNotification, setUploadNotification] = useState<string | null>(null); // ✅ Show upload notification

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    const progressData = fileArray.map((file) => ({
      name: file.name,
      progress: 0,
    }));

    setUploadProgress(progressData);
    setUploading(true);

    // ✅ Simulate upload progress
    fileArray.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, progress: Math.min(progress, 100) } : item
          )
        );

        if (progress >= 100) {
          clearInterval(interval);

          // ✅ When last file completes
          if (index === fileArray.length - 1) {
            setTimeout(() => {
              setUploading(false);
              setUploadedFiles((prev) => [...prev, ...fileArray]); // ✅ Store files
              setUploadProgress([]);

              // ✅ Show notification
              setUploadNotification(`${fileArray.length} file(s) uploaded successfully.`);
              setTimeout(() => setUploadNotification(null), 3000);
            }, 500);
          }
        }
      }, 200);
    });
  };

  const handleSend = () => {
    if (!query.trim()) return;
    setSubmitted(true);
    setResponse(null);

    setTimeout(() => {
      setResponse(`You asked: "${query}" — Here's a mock response from the backend.`);
    }, 1000);
  };

  const handleSuggestedClick = (text: string) => {
    setQuery(text);
    setSubmitted(true);
    setResponse(null);

    setTimeout(() => {
      setResponse(`You selected: "${text}" — Here's a mock response from the backend.`);
    }, 1000);
  };

  return (
    <main className="flex-1 flex flex-col relative">
      {/* ✅ Notification */}
      {uploadNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md z-10">
          {uploadNotification}
        </div>
      )}

      {/* Top Bar */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search knowledge base..."
            className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center">
          <button className="ml-2 p-2 hover:bg-gray-100 rounded-md">
            {/* Notification Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405..." />
            </svg>
          </button>
          <button className="ml-2 p-2 bg-blue-600 text-white rounded-md">Log in</button>
        </div>
      </div>

      {/* Main Content */}
      {!submitted ? (
        <div className="flex-1 p-6 overflow-auto">
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            {!uploading ? (
              <>
                <h2 className="text-xl font-semibold mb-2">Welcome to Enterprise RAG Assistant</h2>
                <p className="text-gray-600 mb-6">
                  Ask questions about your organization's documents...
                </p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                    Upload Documents
                    <input
                      id="multiple_files"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Connect Data Source
                  </button>
                </div>
                {/* ✅ List Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-gray-700 font-medium mb-2">Uploaded Files:</h4>
                    <ul className="list-disc ml-5 text-sm text-gray-800">
                      {uploadedFiles.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-lg font-medium mb-4">Uploading Files...</h2>
                <ul className="space-y-3">
                  {uploadProgress.map((file, idx) => (
                    <li key={idx} className="text-sm">
                      <div className="font-medium text-gray-800 mb-1">{file.name}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Suggested Prompts */}
          <div className="mb-8">
            <h3 className="text-gray-700 font-medium mb-4">Try asking about:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "What are our data retention policies?",
                "Generate a summary of our 2023 compliance guidelines",
                "Extract key points from the latest product roadmap",
                "Find information about our customer onboarding process"
              ].map((item) => (
                <div
                  key={item}
                  className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestedClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-4 text-lg text-gray-700 font-medium">Chat Response</div>
          {response ? (
            <div className="p-4 bg-gray-100 rounded-md text-gray-800">{response}</div>
          ) : (
            <div className="text-gray-500">Loading response...</div>
          )}
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t border-gray-200 pt-4 px-6">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            {/* Optional Icon */}
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question or give instructions..."
            className="flex-1 p-2 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="ml-2 px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
