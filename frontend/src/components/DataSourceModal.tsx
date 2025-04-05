import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaDropbox } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';


interface Props {
  onAuthClick: (provider: 'gdrive' | 'dropbox' | 'notion') => void;
  onClose: () => void;
}

const DataSourceModal: React.FC<Props> = ({ onAuthClick, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Transparent background that still captures click */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl p-6 w-80 z-10 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-center">Connect a Data Source</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onAuthClick('gdrive')}
            className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FcGoogle className="text-xl" />
            <span>Connect Google Drive</span>
          </button>

          <button
            onClick={() => onAuthClick('dropbox')}
            className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaDropbox className="text-blue-600 text-xl" />
            <span>Connect Dropbox</span>
          </button>

          <button
            onClick={() => onAuthClick('notion')}
            className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SiNotion className="text-black text-xl" />
            <span>Connect Notion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSourceModal;
