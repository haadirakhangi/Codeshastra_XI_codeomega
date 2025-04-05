import { useState } from 'react';
import ChatContent from "../components/ChatContent";
import Canvas from "../components/Canvas";

function ChatInterface() {
  const [showCanvas, setShowCanvas] = useState(true);
  const [canvasTitle, setCanvasTitle] = useState("# Design: The Differentiator Your Brand Can't Ignore");
  const [canvasContent, setCanvasContent] = useState(`
## Introduction

In an increasingly competitive and fast-paced world, **design** has emerged as a critical *differentiator*...

## Design Enhances User Experience

At its core, **design** is about *problem-solving*...

## Design Drives Business Success

Investing in **quality design** isn't just beneficial for users...
`);
  
  // Function to handle canvas close and save data
  const handleCanvasClose = (title: string, content: string) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setShowCanvas(false);
  };

  // Function to reopen canvas when document box is clicked
  const handleDocumentClick = () => {
    setShowCanvas(true);
  };

  return (
    <div className="flex h-screen bg-white">
      <ChatContent 
        onDocumentClick={handleDocumentClick} 
        documentTitle={canvasTitle.replace(/^# /, '')} 
        showDocumentBox={!showCanvas} 
      />
      {showCanvas && (
        <Canvas 
          initialTitle={canvasTitle}
          initialContent={canvasContent}
          onClose={handleCanvasClose}
        />
      )}
    </div>
  );
}

export default ChatInterface;