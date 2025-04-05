// // PrivilegeMatrixForm.tsx
// import React, { useState } from 'react';

// // Define types for our data structure
// type PrivilegeValue = boolean;

// interface RolePrivileges {
//   view: PrivilegeValue;
//   download: PrivilegeValue;
//   edit: PrivilegeValue;
//   share: PrivilegeValue;
//   delete: PrivilegeValue;
// }

// interface DepartmentRole {
//   role: string;
//   privileges: RolePrivileges;
// }

// interface Department {
//   name: string;
//   roles: DepartmentRole[];
// }

// const Policy: React.FC = () => {
//   // Initial data structure based on the provided matrix
//   const [departments, setDepartments] = useState<Department[]>([
//     {
//       name: "Legal",
//       roles: [
//         {
//           role: "Admin",
//           privileges: { view: true, download: true, edit: true, share: true, delete: true }
//         },
//         {
//           role: "Manager",
//           privileges: { view: true, download: true, edit: true, share: true, delete: false }
//         },
//         {
//           role: "Employee",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Contractor",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Intern",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         }
//       ]
//     },
//     {
//       name: "HR",
//       roles: [
//         {
//           role: "Admin",
//           privileges: { view: true, download: true, edit: true, share: true, delete: true }
//         },
//         {
//           role: "Manager",
//           privileges: { view: true, download: true, edit: true, share: false, delete: false }
//         },
//         {
//           role: "Employee",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Contractor",
//           privileges: { view: false, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Intern",
//           privileges: { view: false, download: false, edit: false, share: false, delete: false }
//         }
//       ]
//     },
//     {
//       name: "Sales",
//       roles: [
//         {
//           role: "Admin",
//           privileges: { view: true, download: true, edit: true, share: true, delete: true }
//         },
//         {
//           role: "Manager",
//           privileges: { view: true, download: true, edit: true, share: true, delete: false }
//         },
//         {
//           role: "Employee",
//           privileges: { view: true, download: true, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Contractor",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Intern",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         }
//       ]
//     },
//     {
//       name: "Engineering",
//       roles: [
//         {
//           role: "Admin",
//           privileges: { view: true, download: true, edit: true, share: true, delete: true }
//         },
//         {
//           role: "Manager",
//           privileges: { view: true, download: true, edit: true, share: false, delete: false }
//         },
//         {
//           role: "Employee",
//           privileges: { view: true, download: true, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Contractor",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Intern",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         }
//       ]
//     },
//     {
//       name: "Finance",
//       roles: [
//         {
//           role: "Admin",
//           privileges: { view: true, download: true, edit: true, share: true, delete: true }
//         },
//         {
//           role: "Manager",
//           privileges: { view: true, download: true, edit: true, share: false, delete: false }
//         },
//         {
//           role: "Employee",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Contractor",
//           privileges: { view: false, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Intern",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         }
//       ]
//     },
//     {
//       name: "IT",
//       roles: [
//         {
//           role: "Admin",
//           privileges: { view: true, download: true, edit: true, share: true, delete: true }
//         },
//         {
//           role: "Manager",
//           privileges: { view: true, download: true, edit: true, share: true, delete: true }
//         },
//         {
//           role: "Employee",
//           privileges: { view: true, download: true, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Contractor",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         },
//         {
//           role: "Intern",
//           privileges: { view: true, download: false, edit: false, share: false, delete: false }
//         }
//       ]
//     }
//   ]);

//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [editedDepartments, setEditedDepartments] = useState<Department[]>(departments);
//   const [expandedDepartments, setExpandedDepartments] = useState<{ [key: string]: boolean }>({});
//   const [activePanel, setActivePanel] = useState<string | null>("Legal");

//   // Toggle department expansion
//   const toggleDepartment = (departmentName: string) => {
//     setActivePanel(activePanel === departmentName ? null : departmentName);
//   };

//   // Handle checkbox changes
//   const handlePrivilegeChange = (
//     departmentIndex: number,
//     roleIndex: number,
//     privilegeKey: keyof RolePrivileges,
//     value: boolean
//   ) => {
//     const updatedDepartments = [...editedDepartments];
//     updatedDepartments[departmentIndex].roles[roleIndex].privileges[privilegeKey] = value;
//     setEditedDepartments(updatedDepartments);
//   };

//   // Start editing mode
//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedDepartments([...departments]);
//   };

//   // Save changes
//   const handleSave = () => {
//     setDepartments(editedDepartments);
//     setIsEditing(false);
//   };

//   // Cancel editing
//   const handleCancel = () => {
//     setIsEditing(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header Bar */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//           <div className="flex items-center">
//             <div className="bg-gray-800 text-white w-8 h-8 rounded flex items-center justify-center mr-2">E</div>
//             <span className="font-semibold text-lg">EnterpriseRAG</span>
//           </div>
//           <div className="flex items-center">
//             <input 
//               type="text" 
//               placeholder="Search knowledge base..." 
//               className="border rounded-md px-3 py-2 mr-4 w-64"
//             />
//             <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
//               Log in
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Page Title */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold flex items-center">
//             <span className="mr-2">🔐</span>
//             Structured File Privilege Matrix
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Configure file access permissions across departments and user roles
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="mb-6 flex justify-end">
//           {!isEditing ? (
//             <button 
//               onClick={handleEdit}
//               className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//               </svg>
//               Edit Permissions
//             </button>
//           ) : (
//             <div className="flex space-x-3">
//               <button 
//                 onClick={handleCancel}
//                 className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleSave}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
//               >
//                 Save Changes
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Privileges Form */}
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           {/* Legend */}
//           <div className="px-4 py-3 bg-gray-50 border-b">
//             <div className="flex space-x-8">
//               <div className="flex items-center">
//                 <span className="text-green-600 mr-2">✅</span>
//                 <span className="text-sm">Allowed</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-red-600 mr-2">🚫</span>
//                 <span className="text-sm">Denied</span>
//               </div>
//             </div>
//           </div>

//           {/* Department Accordion Panels */}
//           <div className="divide-y">
//             {departments.map((department, departmentIndex) => (
//               <div key={department.name} className="overflow-hidden">
//                 {/* Department Header */}
//                 <button
//                   onClick={() => toggleDepartment(department.name)}
//                   className={`w-full px-4 py-3 flex items-center justify-between text-left ${
//                     activePanel === department.name ? 'bg-gray-50' : 'bg-white'
//                   }`}
//                 >
//                   <span className="font-medium">{department.name}</span>
//                   <svg
//                     className={`h-5 w-5 transform ${
//                       activePanel === department.name ? 'rotate-180' : ''
//                     }`}
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>

//                 {/* Department Content */}
//                 {activePanel === department.name && (
//                   <div className="px-4 py-3 border-t">
//                     {/* Header Row */}
//                     <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 mb-2 px-2">
//                       <div>Role</div>
//                       <div className="text-center">View</div>
//                       <div className="text-center">Download</div>
//                       <div className="text-center">Edit</div>
//                       <div className="text-center">Share</div>
//                       <div className="text-center">Delete</div>
//                     </div>

//                     {/* Role Rows */}
//                     {department.roles.map((role, roleIndex) => (
//                       <div 
//                         key={role.role} 
//                         className="grid grid-cols-6 gap-4 py-3 border-t first:border-t-0"
//                       >
//                         <div className="font-medium">{role.role}</div>
                        
//                         {/* View */}
//                         <div className="flex justify-center">
//                           {isEditing ? (
//                             <label className="relative inline-flex items-center cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={editedDepartments[departmentIndex].roles[roleIndex].privileges.view}
//                                 onChange={(e) => handlePrivilegeChange(
//                                   departmentIndex,
//                                   roleIndex,
//                                   'view',
//                                   e.target.checked
//                                 )}
//                               />
//                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
//                             </label>
//                           ) : (
//                             <span className={role.privileges.view ? "text-green-600" : "text-red-600"}>
//                               {role.privileges.view ? "✅" : "🚫"}
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Download */}
//                         <div className="flex justify-center">
//                           {isEditing ? (
//                             <label className="relative inline-flex items-center cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={editedDepartments[departmentIndex].roles[roleIndex].privileges.download}
//                                 onChange={(e) => handlePrivilegeChange(
//                                   departmentIndex,
//                                   roleIndex,
//                                   'download',
//                                   e.target.checked
//                                 )}
//                               />
//                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
//                             </label>
//                           ) : (
//                             <span className={role.privileges.download ? "text-green-600" : "text-red-600"}>
//                               {role.privileges.download ? "✅" : "🚫"}
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Edit */}
//                         <div className="flex justify-center">
//                           {isEditing ? (
//                             <label className="relative inline-flex items-center cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={editedDepartments[departmentIndex].roles[roleIndex].privileges.edit}
//                                 onChange={(e) => handlePrivilegeChange(
//                                   departmentIndex,
//                                   roleIndex,
//                                   'edit',
//                                   e.target.checked
//                                 )}
//                               />
//                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
//                             </label>
//                           ) : (
//                             <span className={role.privileges.edit ? "text-green-600" : "text-red-600"}>
//                               {role.privileges.edit ? "✅" : "🚫"}
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Share */}
//                         <div className="flex justify-center">
//                           {isEditing ? (
//                             <label className="relative inline-flex items-center cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={editedDepartments[departmentIndex].roles[roleIndex].privileges.share}
//                                 onChange={(e) => handlePrivilegeChange(
//                                   departmentIndex,
//                                   roleIndex,
//                                   'share',
//                                   e.target.checked
//                                 )}
//                               />
//                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
//                             </label>
//                           ) : (
//                             <span className={role.privileges.share ? "text-green-600" : "text-red-600"}>
//                               {role.privileges.share ? "✅" : "🚫"}
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Delete */}
//                         <div className="flex justify-center">
//                           {isEditing ? (
//                             <label className="relative inline-flex items-center cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={editedDepartments[departmentIndex].roles[roleIndex].privileges.delete}
//                                 onChange={(e) => handlePrivilegeChange(
//                                   departmentIndex,
//                                   roleIndex,
//                                   'delete',
//                                   e.target.checked
//                                 )}
//                               />
//                               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
//                             </label>
//                           ) : (
//                             <span className={role.privileges.delete ? "text-green-600" : "text-red-600"}>
//                               {role.privileges.delete ? "✅" : "🚫"}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* General Section */}
//         <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
//           <div className="px-4 py-3 bg-gray-50 border-b">
//             <h3 className="font-medium">General Access</h3>
//           </div>
//           <div className="p-4">
//             <div className="flex items-center justify-between p-2 border-b">
//               <div className="font-medium">All Roles</div>
//               <div className="grid grid-cols-5 gap-8">
//                 <div className="text-center text-green-600">✅</div>
//                 <div className="text-center text-green-600">✅<br/><span className="text-xs text-gray-500">(except Interns)</span></div>
//                 <div className="text-center text-red-600">🚫</div>
//                 <div className="text-center text-red-600">🚫</div>
//                 <div className="text-center text-red-600">🚫</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Policy;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Policy = () => {
  // State for policy text (would come from backend in production)
  const [policyText, setPolicyText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Simulating backend data fetch
  useEffect(() => {
    // In production, replace with actual API call
    const fetchPolicy = async () => {
      try {
        // Simulating API delay
        setTimeout(() => {
          // This would be the response from your backend
          const mockPolicyText = `# User Privileges Policy
          
## Access Levels
Users are granted access based on their role within the organization. The following access levels are available:

### Level 1: Basic User
- View company documents
- Access personal dashboard
- Submit basic requests

### Level 2: Team Lead
- All Basic User privileges
- Approve team member requests
- Access department analytics

### Level 3: Manager
- All Team Lead privileges
- Create new policy documents
- Manage team permissions

### Level 4: Administrator
- Full system access
- User management capabilities
- System configuration controls

## Policy Updates
All policy changes require approval from the compliance department before implementation. Users will be notified via email when policies affecting their access are updated.`;
          
          setPolicyText(mockPolicyText);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching policy:", error);
        setIsLoading(false);
      }
    };
    
    fetchPolicy();
  }, []);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // In production, you would send this feedback to your backend
    console.log("Feedback submitted:", feedback);
    setShowThankYou(true);
    
    setTimeout(() => {
      setShowThankYou(false);
      setFeedback('');
    }, 3000);
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