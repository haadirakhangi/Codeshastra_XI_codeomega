import React, { useState } from 'react';
import { Upload, ChevronDown, X } from 'lucide-react';

const departments = ['All Departments', 'Sales', 'Finance', 'HR', 'IT', 'Legal', 'Operations'];
const roles = ['All Roles', 'Admin', 'Manager', 'Intern'];

const UploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [visibleToDept, setVisibleToDept] = useState<string>('Finance');
  const [visibleToRole, setVisibleToRole] = useState<string>('Manager');
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      console.log(`Uploading file: ${selectedFile.name}`);
      console.log(`Visible to department: ${visibleToDept}`);
      console.log(`Visible to role: ${visibleToRole}`);
      // In a real app, you would send this to your backend
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // formData.append('department', visibleToDept);
      // formData.append('role', visibleToRole);
      // axios.post('/api/upload', formData);
    }
  };
  
  return (
    <div className="flex justify-start">
      <div className="flex flex-col items-start">
        <div className="max-w-[75%] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-blue-50 p-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center">
              <Upload size={18} className="text-blue-600" />
              <span className="ml-2 font-medium text-gray-800">Upload Document</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
          
          <div className="p-4">
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer ${
                  isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <Upload size={24} className={isDragging ? 'text-blue-500' : 'text-gray-400'} />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your file here, or{' '}
                  <span className="text-blue-600 font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOCX, XLSX, JPG, PNG
                </p>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">
                      {selectedFile.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Visible to Department</label>
                <div className="relative">
                  <select
                    value={visibleToDept}
                    onChange={(e) => setVisibleToDept(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Visible to Role</label>
                <div className="relative">
                  <select
                    value={visibleToRole}
                    onChange={(e) => setVisibleToRole(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                  selectedFile
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedFile}
                onClick={handleUpload}
              >
                <Upload size={16} className="mr-1" />
                Upload
              </button>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1 px-1">9:02 AM</div>
      </div>
    </div>
  );
};

export default UploadComponent;