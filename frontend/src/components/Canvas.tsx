import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasProps {
    initialTitle?: string;
    initialContent?: string;
    onClose?: (title: string, content: string) => void;
}

const parseMarkdownLine = (line: string, index: number) => {
    if (line.startsWith('###')) {
        return <h3 key={index} className="text-lg font-semibold mt-4">{line.replace('### ', '')}</h3>;
    } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold mt-6">{line.replace('## ', '')}</h2>;
    } else if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-extrabold mt-8">{line.replace('# ', '')}</h1>;
    }

    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    let parsed = line;

    const renderStyledText = (text: string) => {
        const parts = [];
        let lastIndex = 0;
        let match;

        boldRegex.lastIndex = 0;
        while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(<strong key={match.index} className="font-semibold">{match[1]}</strong>);
            lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts.flatMap((part, i) => {
            if (typeof part === 'string') {
                const italics = [];
                let lastItalicIndex = 0;
                italicRegex.lastIndex = 0;
                while ((match = italicRegex.exec(part)) !== null) {
                    if (match.index > lastItalicIndex) {
                        italics.push(part.substring(lastItalicIndex, match.index));
                    }
                    italics.push(<em key={i + '-' + match.index} className="italic">{match[1]}</em>);
                    lastItalicIndex = italicRegex.lastIndex;
                }
                if (lastItalicIndex < part.length) {
                    italics.push(part.substring(lastItalicIndex));
                }
                return italics;
            }
            return part;
        });
    };

    return <p key={index} className="text-base leading-relaxed text-gray-800">{renderStyledText(parsed)}</p>;
};

// Improved text streaming animation component with character-by-character effect
const TextStreamingEffect: React.FC<{ text: JSX.Element[] }> = ({ text }) => {
    const [displayedLines, setDisplayedLines] = useState<JSX.Element[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [currentLineContent, setCurrentLineContent] = useState<JSX.Element | null>(null);
    
    useEffect(() => {
        // Reset animation when text changes
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCharIndex(0);
        setCurrentLineContent(null);
    }, [text]);
    
    useEffect(() => {
        if (currentLineIndex >= text.length) return;
        
        const currentLine = text[currentLineIndex];
        
        // For heading elements, we handle them as complete elements
        if (
            React.isValidElement(currentLine) && 
            (currentLine.type === 'h1' || currentLine.type === 'h2' || currentLine.type === 'h3')
        ) {
            const timer = setTimeout(() => {
                setDisplayedLines(prev => [...prev, currentLine]);
                setCurrentLineIndex(prev => prev + 1);
                setCharIndex(0);
                setCurrentLineContent(null);
            }, 500); // Slower typing for headings
            
            return () => clearTimeout(timer);
        }
        
        // For paragraph content, handle character by character for text
        if (React.isValidElement(currentLine) && currentLine.type === 'p') {
            // Extract the children to process character by character
            const children = React.Children.toArray(currentLine.props.children);
            let totalLength = 0;
            const flatChildren = children.map(child => {
                if (typeof child === 'string') {
                    totalLength += child.length;
                    return child;
                } else if (React.isValidElement(child)) {
                    // For elements like <strong> or <em>
                    const content = child.props.children;
                    if (typeof content === 'string') {
                        totalLength += content.length;
                    }
                    return child;
                }
                return '';
            });
            
            if (charIndex <= totalLength) {
                let currentChar = 0;
                const processedChildren = flatChildren.map((child, idx) => {
                    if (typeof child === 'string') {
                        // For plain text, show up to charIndex
                        const visiblePart = child.substring(0, Math.max(0, charIndex - currentChar));
                        currentChar += child.length;
                        return visiblePart;
                    } else if (React.isValidElement(child)) {
                        // For styled text (bold/italic)
                        const content = child.props.children;
                        if (typeof content === 'string') {
                            const visiblePart = content.substring(0, Math.max(0, charIndex - currentChar));
                            currentChar += content.length;
                            return React.cloneElement(child, {}, visiblePart);
                        }
                    }
                    return child;
                });
                
                const currentLineWithTyping = React.cloneElement(
                    currentLine,
                    { ...currentLine.props },
                    processedChildren
                );
                
                setCurrentLineContent(currentLineWithTyping);
                
                // Only advance to next character if we haven't completed the line
                if (charIndex < totalLength) {
                    const speed = Math.random() * 50 + 30; // Random speed between 30-80ms for more natural effect
                    const timer = setTimeout(() => {
                        setCharIndex(prev => prev + 1);
                    }, speed);
                    
                    return () => clearTimeout(timer);
                } else {
                    // Line is complete, move to next line
                    const timer = setTimeout(() => {
                        setDisplayedLines(prev => [...prev, currentLine]);
                        setCurrentLineIndex(prev => prev + 1);
                        setCharIndex(0);
                        setCurrentLineContent(null);
                    }, 200); // Pause between lines
                    
                    return () => clearTimeout(timer);
                }
            }
        }
    }, [currentLineIndex, charIndex, text]);
    
    return (
        <>
            {displayedLines}
            {currentLineContent}
            {/* Add blinking cursor effect at the end of typing */}
            {currentLineContent && (
                <span className="inline-block w-2 h-4 ml-1 bg-black animate-pulse"></span>
            )}
        </>
    );
};

const Canvas: React.FC<CanvasProps> = ({
    initialTitle = '# Design: The Differentiator Your Brand Can\'t Ignore',
    initialContent = `
## Introduction

In an increasingly competitive and fast-paced world, **design** has emerged as a critical *differentiator*...

## Design Enhances User Experience

At its core, **design** is about *problem-solving*...

## Design Drives Business Success

Investing in **quality design** isn't just beneficial for users...
`,
    onClose
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isEdited, setIsEdited] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);
    const [tempContent, setTempContent] = useState(content);
    
    // For text streaming effect
    const [showStreamingEffect, setShowStreamingEffect] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleBack = () => {
        // Animate window closing
        setIsVisible(false);
        // Pass the current title and content back to parent before closing
        setTimeout(() => {
            if (onClose) {
                onClose(title, content);
            }
        }, 500);
    };
    
    const handlePrev = () => console.log('Previous clicked');
    const handleNext = () => console.log('Next clicked');

    const handleEdit = () => {
        setTempTitle(title);
        setTempContent(content);
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const handleSave = () => {
        setTitle(tempTitle);
        setContent(tempContent);
        setIsEdited(true);
        setEditMode(false);
        // Reset streaming effect when content changes
        setShowStreamingEffect(true);
    };

    const renderMarkdown = (text: string) => {
        const elements = text
            .split('\n')
            .filter(line => line.trim() !== '')
            .map((line, idx) => parseMarkdownLine(line, idx));
        
        if (showStreamingEffect && !editMode) {
            return <TextStreamingEffect text={elements} />;
        }
        
        return elements;
    };

    // Once streaming is complete, this will turn off the effect
    // Increased the timeout to allow the slower typing effect to complete
    useEffect(() => {
        const estimatedTimeForAnimation = content.length * 50 + 2000; // Rough estimate based on content length
        const timer = setTimeout(() => {
            setShowStreamingEffect(false);
        }, estimatedTimeForAnimation);
        
        return () => clearTimeout(timer);
    }, [content, title]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    className="flex flex-col h-screen bg-gray-50 w-[650px]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Top Navigation */}
                    <motion.div 
                        className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-white"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center">
                            <button onClick={handleBack} className="p-2 mr-2 rounded hover:bg-gray-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <span className="text-gray-600">Design notes</span>
                        </div>
                        <div className="flex items-center mb-4">
                            {!editMode ? (
                                <motion.div 
                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                                    onClick={handleEdit}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </motion.div>
                            ) : (
                                <div className="ml-3 space-y-2">
                                    <div className="flex gap-2">
                                        <motion.button
                                            onClick={handleSave}
                                            className="px-4 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Save
                                        </motion.button>
                                        <motion.button
                                            onClick={handleCancel}
                                            className="px-4 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Main content */}
                    <div className="flex flex-grow overflow-hidden bg-white">
                        {/* Content Area */}
                        <motion.div 
                            className="flex-grow overflow-y-auto p-6 space-y-6"
                            ref={contentRef}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {editMode ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <textarea
                                        value={tempTitle}
                                        onChange={(e) => setTempTitle(e.target.value)}
                                        className="w-full text-2xl font-bold border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                                    />
                                    <textarea
                                        value={tempContent}
                                        onChange={(e) => setTempContent(e.target.value)}
                                        rows={15}
                                        className="w-full text-base border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                                    />
                                </motion.div>
                            ) : (
                                <div className="prose prose-slate max-w-none">
                                    {renderMarkdown(title)}
                                    {renderMarkdown(content)}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Canvas;