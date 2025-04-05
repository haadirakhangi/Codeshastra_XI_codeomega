// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatInterface from './pages/Chatinterface'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENTID;
import Login from "./pages/Login"
import Register from './pages/Register';

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Example additional route */}
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
