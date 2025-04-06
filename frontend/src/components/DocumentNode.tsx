import React from 'react';
import { Handle, Position } from '@xyflow/react';

type DocumentNodeProps = {
  data: { 
    id: string;
    label: string;
    content?: string;
    type: string;
    file?: File;
    preview?: string;
  };
};

export function DocumentNode({ data }: DocumentNodeProps) {
  return (
    <div className="relative bg-amber-200 shadow-md rounded-lg p-4 border border-gray-200 min-w-[180px] max-w-[1000px]">
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 rounded-full border-2 border-primary bg-white right-[-6px]"
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary bg-opacity-10 p-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <span className="font-medium text-sm truncate">{data.label}</span>
          </div>
        </div>
        
        {data.preview && (
          <div className="mt-2 border rounded-md overflow-hidden">
            {data.type.startsWith('image/') ? (
              <img 
                src={data.preview} 
                alt={data.label} 
                className="w-full object-cover max-h-[100px]" 
              />
            ) : (
              <div className="text-xs text-gray-600 p-2 max-h-[100px] overflow-hidden">
                {data.content || 'Document content preview'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}