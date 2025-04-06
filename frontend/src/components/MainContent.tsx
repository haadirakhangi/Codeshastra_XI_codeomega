import React, { useState } from 'react';
import DataSourceModal from './DataSourceModal';
import GDrivePicker from './GDrivePicker';

const MainContent: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; progress: number }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadNotification, setUploadNotification] = useState<string | null>(null);
  const [showDataSourceModal, setShowDataSourceModal] = useState(false);
  const [gdriveFiles, setGdriveFiles] = useState<{ id: string; name: string }[]>([]);
  const [showGDrivePicker, setShowGDrivePicker] = useState(false);

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

      <div className="flex-1 p-6 overflow-auto">
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          {!uploading ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Upload or Connect Data</h2>
              <div className="flex flex-wrap gap-4 mb-4">
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
                <button
                  onClick={() => setShowDataSourceModal(true)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Connect Data Source
                </button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gray-700 font-medium mb-2">Uploaded Files:</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-800">
                    {uploadedFiles.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {gdriveFiles.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gray-700 font-medium mb-2">Google Drive Files:</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-800">
                    {gdriveFiles.map((file) => (
                      <li key={file.id}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Submit
              </button>
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
      </div>
    </main>
  );
};

export default MainContent;
