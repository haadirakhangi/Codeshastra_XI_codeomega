import React, { useState } from 'react';
import DataSourceModal from './DataSourceModal';
import GDrivePicker from './GdrivePicker';
import '../index.css'

const MainContent: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; progress: number }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadNotification, setUploadNotification] = useState<string | null>(null);
  const [showDataSourceModal, setShowDataSourceModal] = useState(false);
  const [gdriveFiles, setGdriveFiles] = useState<{ id: string; name: string }[]>([]);
  const [showGDrivePicker, setShowGDrivePicker] = useState(false);

  // Added state for active tab in the info panel
  const [activeInfoTab, setActiveInfoTab] = useState('types');

  // Example supported file types and limits
  const supportedTypes = ['PDF', 'DOCX', 'TXT', 'CSV', 'XLSX', 'PPTX', 'JSON'];
  const maxFileSize = '25MB';

  // Example recent activity data
  const recentActivity = [
    { name: 'quarterly_report.pdf', date: '3 days ago', type: 'PDF' },
    { name: 'product_specs.docx', date: '1 week ago', type: 'DOCX' },
    { name: 'survey_results.xlsx', date: 'Apr 2, 2025', type: 'XLSX' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const progressData = fileArray.map((file) => ({ name: file.name, progress: 0 }));

    setUploadProgress(progressData);
    setUploading(true);

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
          if (index === fileArray.length - 1) {
            setTimeout(() => {
              setUploading(false);
              setUploadedFiles((prev) => [...prev, ...fileArray]);
              setUploadProgress([]);
              setUploadNotification(`${fileArray.length} file(s) uploaded successfully.`);
              setTimeout(() => setUploadNotification(null), 3000);
            }, 500);
          }
        }
      }, 200);
    });
  };

  const handleAuthClick = async (provider: 'gdrive' | 'dropbox' | 'notion') => {
    if (provider === 'gdrive') {
      setShowDataSourceModal(false);
      setShowGDrivePicker(true);
    }
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0 && gdriveFiles.length === 0) {
      setUploadNotification("No files to submit.");
      setTimeout(() => setUploadNotification(null), 3000);
      return;
    }

    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append('files', file));
    formData.append('gdriveFiles', JSON.stringify(gdriveFiles));

    try {
      const res = await fetch('/api/upload-docs', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadNotification("Documents submitted successfully!");
        setUploadedFiles([]);
        setGdriveFiles([]);
      } else {
        setUploadNotification("Failed to submit documents.");
      }
    } catch (err) {
      setUploadNotification("Error submitting documents.");
    } finally {
      setTimeout(() => setUploadNotification(null), 3000);
    }
  };

  // Helper function to render file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M9 15v-2h6v2"></path>
            <path d="M12 15v4"></path>
          </svg>
        );
      case 'docx':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        );
      case 'xlsx':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        );
    }
  };

  return (
    <main className="flex-1 flex flex-col relative">
      {uploadNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md z-10">
          {uploadNotification}
        </div>
      )}

      {showDataSourceModal && (
        <DataSourceModal onAuthClick={handleAuthClick} onClose={() => setShowDataSourceModal(false)} />
      )}

      {showGDrivePicker && (
        <div className="p-4">
          <GDrivePicker
            onFilesSelected={(files) => {
              setGdriveFiles(files);
              setUploadNotification(`${files.length} file(s) imported from Google Drive.`);
              setShowGDrivePicker(false);
              setTimeout(() => setUploadNotification(null), 3000);
            }}
          />
        </div>
      )}

      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Document Management</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stats Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Storage Usage</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">2.3 GB of 10 GB</span>
                <span className="text-sm text-gray-600">23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>

            {/* Document Count Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Documents</h3>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-gray-800">42</div>
                <div className="text-sm text-gray-500">
                  <div>12 PDFs</div>
                  <div>18 Docs</div>
                  <div>8 Sheets</div>
                  <div>4 Others</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Upload
                </button>
                <button onClick={() => setShowDataSourceModal(true)} className="flex items-center justify-center p-3 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                  </svg>
                  Connect
                </button>
                <button className="flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Search
                </button>
                <button className="flex items-center justify-center p-3 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M4 11a9 9 0 0 1 9 9"></path>
                    <path d="M4 4a16 16 0 0 1 16 16"></path>
                    <circle cx="5" cy="19" r="1"></circle>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Main Upload Area */}
          <div className="border border-gray-200 rounded-lg bg-white shadow-sm mb-8">
            <div className="p-6">
              {!uploading ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">Upload or Connect Data</h2>

                  {/* Empty state when no files */}
                  {uploadedFiles.length === 0 && gdriveFiles.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg mb-6 bg-gray-50">
                      <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No documents uploaded yet</h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Upload files from your device or connect to cloud storage like Google Drive to get started
                      </p>

                      <div className="flex flex-wrap justify-center gap-4">
                        <label htmlFor="multiple_files" className="Documents-btn cursor-pointer">
                          <span className="folderContainer">
                            <svg
                              className="fileBack"
                              width="146"
                              height="113"
                              viewBox="0 0 146 113"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 4C0 1.79086 1.79086 0 4 0H50.3802C51.8285 0 53.2056 0.627965 54.1553 1.72142L64.3303 13.4371C65.2799 14.5306 66.657 15.1585 68.1053 15.1585H141.509C143.718 15.1585 145.509 16.9494 145.509 19.1585V109C145.509 111.209 143.718 113 141.509 113H3.99999C1.79085 113 0 111.209 0 109V4Z"
                                fill="url(#paint0_linear_117_4)"
                              ></path>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_117_4"
                                  x1="0"
                                  y1="0"
                                  x2="72.93"
                                  y2="95.4804"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#8F88C2" />
                                  <stop offset="1" stopColor="#5C52A2" />
                                </linearGradient>
                              </defs>
                            </svg>

                            <svg
                              className="filePage"
                              width="88"
                              height="99"
                              viewBox="0 0 88 99"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width="88" height="99" fill="url(#paint0_linear_117_6)" />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_117_6"
                                  x1="0"
                                  y1="0"
                                  x2="81"
                                  y2="160.5"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="white" />
                                  <stop offset="1" stopColor="#686868" />
                                </linearGradient>
                              </defs>
                            </svg>

                            <svg
                              className="fileFront"
                              width="160"
                              height="79"
                              viewBox="0 0 160 79"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.29306 12.2478C0.133905 9.38186 2.41499 6.97059 5.28537 6.97059H30.419H58.1902C59.5751 6.97059 60.9288 6.55982 62.0802 5.79025L68.977 1.18034C70.1283 0.410771 71.482 0 72.8669 0H77H155.462C157.87 0 159.733 2.1129 159.43 4.50232L150.443 75.5023C150.19 77.5013 148.489 79 146.474 79H7.78403C5.66106 79 3.9079 77.3415 3.79019 75.2218L0.29306 12.2478Z"
                                fill="url(#paint0_linear_117_5)"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_117_5"
                                  x1="38.7619"
                                  y1="8.71323"
                                  x2="66.9106"
                                  y2="82.8317"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#C3BBFF" />
                                  <stop offset="1" stopColor="#51469A" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </span>

                          <p className="text">Upload Documents</p>

                          <input
                            id="multiple_files"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </label>

                        <button
                          onClick={() => setShowDataSourceModal(true)}
                          className="flex items-center px-5 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                          </svg>
                          Connect Data Source
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display uploaded files if any */}
                  {(uploadedFiles.length > 0 || gdriveFiles.length > 0) && (
                    <div className="border-2 border-gray-200 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800">Selected Documents</h3>
                        <div className="flex gap-2">
                          <label htmlFor="multiple_files" className="cursor-pointer px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Add More
                            <input
                              id="multiple_files"
                              type="file"
                              multiple
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>

                          <button
                            onClick={() => setShowDataSourceModal(true)}
                            className="px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            Connect
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {uploadedFiles.length > 0 && (
                          <div>
                            <h4 className="text-gray-600 text-sm mb-2">Local Files</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {uploadedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center p-2 bg-gray-50 rounded-md">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-600">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                  </svg>
                                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {gdriveFiles.length > 0 && (
                          <div>
                            <h4 className="text-gray-600 text-sm mb-2">Google Drive Files</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {gdriveFiles.map((file) => (
                                <div key={file.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                                  </svg>
                                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={handleSubmit}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Process Documents
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Information Tabs */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex border-b border-gray-200">
                      <button
                        className={`px-4 py-3 text-sm font-medium ${activeInfoTab === 'types' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveInfoTab('types')}
                      >
                        Supported Types
                      </button>
                      <button
                        className={`px-4 py-3 text-sm font-medium ${activeInfoTab === 'recent' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveInfoTab('recent')}
                      >
                        Recent Activity
                      </button>
                      <button
                        className={`px-4 py-3 text-sm font-medium ${activeInfoTab === 'tips' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveInfoTab('tips')}
                      >
                        Tips
                      </button>
                    </div>

                    <div className="p-4">
                      {activeInfoTab === 'types' && (
                        <div>
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-600">Maximum File Size: </span>
                            <span className="text-sm text-gray-800">{maxFileSize}</span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Supported File Types:</h4>
                          <div className="flex flex-wrap gap-2">
                            {supportedTypes.map((type, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeInfoTab === 'recent' && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-3">Recently Processe<h4 className="text-sm font-medium text-gray-600 mb-3">Recently Processed Documents:</h4>
                            <div className="space-y-2">
                              {recentActivity.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center">
                                    {getFileIcon(item.type)}
                                    <span className="ml-2 text-sm text-gray-800">{item.name}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">{item.date}</span>
                                </div>
                              ))}
                            </div>
                          </h4>
                        </div>
                      )}

                      {activeInfoTab === 'tips' && (
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-1 rounded-full text-blue-600 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                              </svg>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-800">Preserve Original Format</h5>
                              <p className="text-xs text-gray-600">For best results, upload files in their original format rather than screenshots or scans.</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="bg-green-100 p-1 rounded-full text-green-600 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-800">Save Progress</h5>
                              <p className="text-xs text-gray-600">Click the "Process Documents" button to save your uploads before navigating away.</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="bg-purple-100 p-1 rounded-full text-purple-600 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 15v3H6v-3"></path>
                                <path d="M3 6h18"></path>
                                <path d="M3 12h18"></path>
                              </svg>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-800">Organize with Tags</h5>
                              <p className="text-xs text-gray-600">After uploading, you can organize documents with tags for easier searching and filtering.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-medium mb-4">Uploading Files...</h2>
                  <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-center mb-6">
                      <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <ul className="space-y-4 max-w-lg mx-auto">
                      {uploadProgress.map((file, idx) => (
                        <li key={idx} className="text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium text-gray-800 truncate">{file.name}</div>
                            <div className="text-indigo-600">{file.progress}%</div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-200"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Learn More Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md text-white p-6 mb-8">
            <div className="md:flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">Need help with your documents?</h3>
                <p className="mb-4 md:mb-0 opacity-90">Learn best practices for organizing, formatting, and processing your documentation.</p>
              </div>
              <button className="px-6 py-2 bg-white text-indigo-600 rounded-md font-medium hover:bg-gray-100 transition-colors">
                View Resources
              </button>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">
              Having trouble with your documents? Contact support at <span className="text-indigo-600">support@example.com</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;