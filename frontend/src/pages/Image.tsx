import React, { useState } from 'react';
import { Search, Upload, ExternalLink, Trash2, Clock } from 'lucide-react';

// Define TypeScript interfaces
interface ImageDocument {
  id: string;
  name: string;
  size: string;
  description: string;
  dateAdded: string;
  status: 'processing' | 'complete';
  source: 'Drive' | 'Dropbox' | 'Notion' | 'Local';
}

interface TabProps {
  name: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

// Tab component
const Tab: React.FC<TabProps> = ({ name, count, active, onClick }) => {
  return (
    <button
      className={`px-4 py-3 text-sm font-medium ${
        active ? 'text-black border-b-2 border-black' : 'text-gray-500'
      }`}
      onClick={onClick}
    >
      {name} ({count})
    </button>
  );
};

// Document Item component
const ImageItem: React.FC<{ document: ImageDocument }> = ({ document }) => {
  return (
    <div className="border-t border-gray-200">
      <div className="flex items-center py-4">
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium truncate">{document.name}</h3>
          <p className="text-sm text-gray-500">{document.size}</p>
          <p className="text-xs text-gray-500 mt-1">{document.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {document.status === 'processing' && (
            <div className="flex items-center text-orange-500 text-sm">
              <Clock size={16} className="mr-1" />
              <span>Processing</span>
            </div>
          )}
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <ExternalLink size={20} />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="pb-2 text-xs text-gray-500">
        Added {document.dateAdded}
      </div>
    </div>
  );
};

// Main component
const ImageDocumentUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [documents, setDocuments] = useState<ImageDocument[]>([
    {
      id: '1',
      name: 'Sales Images',
      size: '15.7 MB',
      description: 'Chart Image of Annual Profit',
      dateAdded: '4/5/2025',
      status: 'complete',
      source: 'Drive'
    },
    {
      id: '2',
      name: 'Product Mockup Images',
      size: '8.2 MB',
      description: 'Product design mockups for marketing',
      dateAdded: '4/5/2025',
      status: 'processing',
      source: 'Dropbox'
    }
  ]);

  // Count documents by source
  const counts = {
    All: documents.length,
    Drive: documents.filter(doc => doc.source === 'Drive').length,
    Dropbox: documents.filter(doc => doc.source === 'Dropbox').length,
    Notion: documents.filter(doc => doc.source === 'Notion').length
  };

  // Filter documents based on active tab
  const filteredDocuments = activeTab === 'All' 
    ? documents 
    : documents.filter(doc => doc.source === activeTab);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">All Images</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search images..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none">
            <Upload size={18} className="mr-2" />
            Upload
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <Tab name="All" count={counts.All} active={activeTab === 'All'} onClick={() => setActiveTab('All')} />
            <Tab name="Drive" count={counts.Drive} active={activeTab === 'Drive'} onClick={() => setActiveTab('Drive')} />
            <Tab name="Dropbox" count={counts.Dropbox} active={activeTab === 'Dropbox'} onClick={() => setActiveTab('Dropbox')} />
            <Tab name="Notion" count={counts.Notion} active={activeTab === 'Notion'} onClick={() => setActiveTab('Notion')} />
          </nav>
        </div>

        <div className="p-4">
          {filteredDocuments.map(doc => (
            <ImageItem key={doc.id} document={doc} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageDocumentUI;