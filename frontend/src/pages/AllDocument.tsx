import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FileItem {
  filename: string;
  path: string;
}

const AllDocument: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const userId = '12345'; // Replace this with actual user ID (from props, context, etc.)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`/api/files`);
        setFiles(res.data.files);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      {/* Top Section (Header + Upload + Search) */}
      {/* ...keep your existing header and buttons */}

      <div className="mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button className="bg-white border border-gray-200 text-gray-900 px-6 py-2 rounded-l-md hover:bg-gray-50">
            All ({files.length})
          </button>
          {/* Add other filters here */}
        </div>
      </div>

      {/* Render All Files */}
      <div className="space-y-4">
        {files.map((file, index) => (
          <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
            <div className="p-4 flex justify-between items-start">
              <div className="flex items-start">
                <div className="mr-4 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{file.filename}</h2>
                  <span className="text-sm text-gray-500">{(Math.random() * 3 + 1).toFixed(2)} MB</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <a href={`http://127.0.0.1:5000/${file.path}`} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-3">
              <p className="text-gray-700">Uploaded document</p>
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Added just now</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-orange-500">Processing</span>
              </div>
            </div>
          </div>
        ))}

        {files.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No documents uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDocument;
