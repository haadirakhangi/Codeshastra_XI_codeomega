import React, { useState } from 'react';
import { Search, Upload, ExternalLink, Trash2, Clock, FileSpreadsheet, Database, Table } from 'lucide-react';

// Define TypeScript interfaces
interface StructuredDataDocument {
  id: string;
  name: string;
  fileType: 'excel' | 'csv' | 'json' | 'xml';
  size: string;
  rowCount?: number;
  columnCount?: number;
  description: string;
  dateAdded: string;
  status: 'processing' | 'complete' | 'error';
  source: 'Drive' | 'Dropbox' | 'Notion' | 'Local';
}

interface TabProps {
  name: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

// File type icon component
const FileTypeIcon: React.FC<{ fileType: string }> = ({ fileType }) => {
  switch (fileType) {
    case 'excel':
      return <FileSpreadsheet size={24} className="text-green-600" />;
    case 'csv':
      return <Table size={24} className="text-blue-600" />;
    case 'json':
    case 'xml':
      return <Database size={24} className="text-purple-600" />;
    default:
      return <FileSpreadsheet size={24} className="text-gray-600" />;
  }
};

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
const DataDocumentItem: React.FC<{ document: StructuredDataDocument }> = ({ document }) => {
  return (
    <div className="border-t border-gray-200">
      <div className="flex items-center py-4">
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            <FileTypeIcon fileType={document.fileType} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium truncate">{document.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">{document.size}</span>
            {document.rowCount && document.columnCount && (
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                {document.rowCount.toLocaleString()} rows × {document.columnCount} columns
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{document.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {document.status === 'processing' && (
            <div className="flex items-center text-orange-500 text-sm">
              <Clock size={16} className="mr-1" />
              <span>Processing</span>
            </div>
          )}
          {document.status === 'error' && (
            <div className="flex items-center text-red-500 text-sm">
              <span>Error</span>
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
const StructuredDataDocumentUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [documents, setDocuments] = useState<StructuredDataDocument[]>([
    {
      id: '1',
      name: '2023 Sales Analysis.xlsx',
      fileType: 'excel',
      size: '2.38 MB',
      rowCount: 15872,
      columnCount: 24,
      description: 'Quarterly sales data with regional breakdown',
      dateAdded: '4/5/2025',
      status: 'complete',
      source: 'Drive'
    },
    {
      id: '2',
      name: 'Customer Demographics.csv',
      fileType: 'csv',
      size: '1.72 MB',
      rowCount: 28450,
      columnCount: 12,
      description: 'User demographics and purchasing behavior',
      dateAdded: '4/5/2025',
      status: 'processing',
      source: 'Dropbox'
    },
    {
      id: '3',
      name: 'API Response Data.json',
      fileType: 'json',
      size: '845 KB',
      description: 'Structured response data from analytics API',
      dateAdded: '4/4/2025',
      status: 'complete',
      source: 'Notion'
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
        <h1 className="text-3xl font-bold">All Structured Data</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
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
            <DataDocumentItem key={doc.id} document={doc} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StructuredDataDocumentUI;