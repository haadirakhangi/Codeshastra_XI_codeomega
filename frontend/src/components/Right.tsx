// components/RightPanel.tsx
import React, { useEffect, useState } from 'react';

const fallbackData = {
  queryStatus: "Successful",
  vectorChunks: 12,
  reranked: 3,
  responseTime: "1.2 seconds"
};

const RightPanel: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/context-data'); // Replace with your backend API
        if (!res.ok) throw new Error('Network error');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.warn("Falling back to static data:", err);
        setData(fallbackData);
      }
    };

    fetchData();
  }, []);

  if (!visible) return null;

  return (
    <aside className="w-80 border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium">Context & Sources</h2>
        <button onClick={() => setVisible(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-8">
          <h3 className="text-xs text-gray-500 font-medium mb-4">SEARCH PROCESS</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Query Understanding</span>
              <span className="text-sm text-green-600">{data.queryStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Vector Search</span>
              <span className="text-sm">{data.vectorChunks} chunks found</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Reranking</span>
              <span className="text-sm">Top {data.reranked} selected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Response Time</span>
              <span className="text-sm">{data.responseTime}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <h3 className="text-xs text-gray-500 font-medium mb-4">QUICK ACTIONS</h3>
          <button className="w-full mb-2 flex items-center justify-center text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save this conversation
          </button>
          <button className="w-full flex items-center justify-center text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Provide feedback
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
