import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Policy = () => {
  // State for policy text (would come from backend in production)
  const [policyText, setPolicyText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get('/api/get-policy');
        setPolicyText(res.data.policy);
      } catch (error) {
        console.error('Error fetching policy:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPolicy();
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
  
    if (!feedback.trim()) return;
  
    try {
      const res = await axios.post('/api/optimize-policy', {
        feedback,
      });
  
      const optimized = res.data.optimizedPolicy;
      setPolicyText(optimized);
      setShowThankYou(true);
    } catch (err) {
      console.error("Failed to optimize policy:", err);
      alert("Error submitting feedback. Please try again.");
    } finally {
      setTimeout(() => {
        setShowThankYou(false);
        setFeedback('');
      }, 3000);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Function to parse markdown-like text
  const renderPolicyText = (text) => {
    if (!text) return null;
    
    // Split by line breaks
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Heading 1
      if (line.startsWith('# ')) {
        return (
          <motion.h1 
            key={index} 
            className="text-2xl font-bold mb-4 text-gray-700"
            variants={itemVariants}
          >
            {line.replace('# ', '')}
          </motion.h1>
        );
      } 
      // Heading 2
      else if (line.startsWith('## ')) {
        return (
          <motion.h2 
            key={index} 
            className="text-xl font-semibold mb-3 mt-6 text-gray-600"
            variants={itemVariants}
          >
            {line.replace('## ', '')}
          </motion.h2>
        );
      }
      // Heading 3
      else if (line.startsWith('### ')) {
        return (
          <motion.h3 
            key={index} 
            className="text-lg font-semibold mb-2 mt-4 text-gray-500"
            variants={itemVariants}
          >
            {line.replace('### ', '')}
          </motion.h3>
        );
      }
      // List items
      else if (line.trim().startsWith('- ')) {
        return (
          <motion.li 
            key={index} 
            className="ml-6 mb-1 list-disc"
            variants={itemVariants}
          >
            {line.replace('- ', '')}
          </motion.li>
        );
      }
      // Regular paragraph
      else if (line.trim() !== '') {
        return (
          <motion.p 
            key={index} 
            className="mb-3"
            variants={itemVariants}
          >
            {line}
          </motion.p>
        );
      }
      // Empty line
      return <br key={index} />;
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-600 text-white p-6">
          <h1 className="text-2xl font-bold">User Privileges Policy</h1>
          <p className="mt-2 opacity-80">Review your access rights and permissions</p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
            </div>
          ) : (
            <motion.div 
              className="policy-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {renderPolicyText(policyText)}
            </motion.div>
          )}
          
          {/* Feedback Form */}
          <motion.div 
            className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Submit Feedback</h3>
            {showThankYou ? (
              <motion.div 
                className="text-green-600 font-medium p-4 bg-green-50 rounded-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Thank you for your feedback!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitFeedback}>
                <div className="mb-4">
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Suggest edits or improvements to this policy
                  </label>
                  <textarea
                    id="feedback"
                    rows="4"
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline focus:border-gray-500"
                    placeholder="Your suggestions here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Policy;