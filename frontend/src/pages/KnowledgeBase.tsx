import React from 'react';

const KnowledgeBase: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button className="bg-gray-900 text-white px-6 py-2 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button className="bg-white border border-gray-200 text-gray-900 px-6 py-2 rounded-l-md hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500">
            All (1)
          </button>
          <button className="bg-white border-t border-b border-gray-200 text-gray-900 px-6 py-2 hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500">
            PDFs (1)
          </button>
          <button className="bg-white border-t border-b border-gray-200 text-gray-900 px-6 py-2 hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500">
            Images (0)
          </button>
          <button className="bg-white border border-gray-200 text-gray-900 px-6 py-2 rounded-r-md hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500">
            Structured Data (0)
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="p-4 flex justify-between items-start">
          <div className="flex items-start">
            <div className="mr-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">2023 Compliance Guidelines</h2>
              <span className="text-sm text-gray-500">2.38 MB</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-1 text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button className="p-1 text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-gray-700">Updated compliance guidelines for 2023</p>
        </div>
        
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">Added 4/5/2025</span>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-orange-500">Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;