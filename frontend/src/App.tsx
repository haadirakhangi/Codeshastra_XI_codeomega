// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatInterface from './pages/ChatInterface';
import AllDocument from './pages/AllDocument';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './components/AdminLayout';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Policy from './pages/Policy';
import ImageDocumentUI from './pages/Image';
import StructuredDataDocumentUI from './pages/Structure';
import PDFDocument from './pages/PDFs';
import ChatContentKush from './components/ChatContentKush';
import GDrivePicker from './components/GDrivePicker';
import ConnectedDocsChat from './components/DocumentNode';
import KushAI from './components/kushAI';

const clientId = import.meta.env.VITE_GOOGLE_CLIENTID;

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes with Sidebar */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Home />} />
            <Route path="chat" element={<ChatInterface />} />
            <Route path="all-document" element={<AllDocument />} />
            <Route path="policy" element={<Policy />} />
            <Route path="images" element={<ImageDocumentUI />} />
            <Route path="structured" element={<StructuredDataDocumentUI />} />
            <Route path="pdfs" element={<PDFDocument />} />
            <Route path="chat-kush" element={<ChatContentKush />} />
<<<<<<< HEAD
            <Route path='gdrive' element={<GDrivePicker/>} />
=======
            <Route path="kush-ai" element={<KushAI />} />
>>>>>>> 0de3de889b466398485643f46734a2ce98795d4f
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
