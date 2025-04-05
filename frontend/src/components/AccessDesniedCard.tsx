import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface AccessDeniedCardProps {
  resource: string;
  reason: string;
  timestamp: string;
}

const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({
  resource,
  reason,
  timestamp
}) => {
  return (
    <div className="flex justify-start">
      <div className="flex flex-col items-start">
        <div className="max-w-[75%] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-red-50 p-3 flex items-center border-b border-gray-200">
            <ShieldAlert size={18} className="text-red-500" />
            <span className="ml-2 font-medium text-gray-800">Access Denied</span>
          </div>
          <div className="p-4">
            <h4 className="font-medium text-gray-800 mb-1">{resource}</h4>
            <p className="text-gray-600 text-sm mb-3">{reason}</p>
            <button
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => console.log(`Requesting access to: ${resource}`)}
            >
              Request Access
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1 px-1">{timestamp}</div>
      </div>
    </div>
  );
};

export default AccessDeniedCard;