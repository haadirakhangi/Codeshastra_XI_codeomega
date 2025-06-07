# 📁 SentraVault

**SentraVault** is a secure, role-aware AI platform designed to streamline access to organizational knowledge and documents across platforms like Google Drive, Notion, and Dropbox. It leverages an adaptive Retrieval-Augmented Generation (RAG) pipeline enhanced with metadata filtering and natural language policy control to ensure compliance, security, and relevance of responses.

**Watch the demo video [here](https://youtu.be/I2wJHDbVi-o?si=0UJLRnP8pMeKEKLa)**

---

## 🚀 Features

### 🔍 Intelligent Document Ingestion

* Upload files or connect external sources (Google Drive, Notion, Dropbox).
* Automatic metadata tagging based on document content, user role, and department.
* Multi-format support: PDF, DOCX, audio notes (transcribed), and more.

### 🧠 Adaptive RAG Pipeline

* Semantic search using **BGE embeddings** and **FAISS** vector indexing.
* Contextual re-ranking and relevance tuning based on user role & query type.
* Dynamically generates natural language responses using LLMs (OpenAI).

### 🛡️ Role-Based Access & Policy Enforcement

* Metadata-level filtering (public, restricted, confidential).
* Natural language policy rules to handle edge cases and dynamic role constraints.

### 🖥️ No-Code Chat Interface

* Intuitive frontend interface with file preview, smart chat suggestions, and guided interactions.
* Virtual assistant capable of content summarization, query-specific analysis, and structured outputs like email drafts or reports.

### 📱 Mobile Companion App (React Native)

* Lightweight, responsive mobile interface for access and chat.
* Role-restricted access with real-time data sync and document previews.

### 📲 Real-Time Admin Alerts

* Unauthorized access or repeated failed attempts are flagged.
* Notifications sent directly via WhatsApp using **WhatsApp Cloud API**.

---

## 🛠️ Tech Stack

| Layer         | Tools/Frameworks                          |
| ------------- | ----------------------------------------- |
| Frontend      | React, TypeScript, Vite                   |
| Backend       | Flask, LangChain, FAISS, OpenAI           |
| Mobile App    | React Native, Tailwind, Expo              |
| Database      | MongoDB, FAISS (vector indexing)          |
| Integrations  | Google Drive API, Notion API, Dropbox API |
| Notifications | WhatsApp Cloud API                        |

---

## 📦 Project Structure

```
haadirakhangi-codeshastra_xi_codeomega/
├── backend/           # Flask API + RAG core + ingestion logic
├── frontend/          # Vite + React frontend app
├── sentra-vault/      # React Native mobile app
└── whatsapp server/   # Node.js WhatsApp alert system
```

---

## ⚙️ Installation & Setup Guide

### 🔧 Prerequisites

* Python ≥ 3.9
* Node.js ≥ 16.x
* npm / yarn
* MongoDB instance (local or cloud)
* OpenAI API Key
* Google Drive, Notion & Dropbox Developer App credentials
* WhatsApp Cloud API setup

---

### 🐍 Backend Setup (Flask)

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create & activate virtual environment:**
```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set environment variables:**

Create a `.env` file in `server-side/`:

```
GEMINI_API_KEY=your_gemini_key
GOOGLE_CLIENT_ID=your_google_cloud_console_client_id
GOOGLE_CLIENT_SECRET=your_google_cloud_console_secret
TAVILY_API_KEY=your_tavily_key
SECRET_KEY=your_flask_secret_key
MONGO_PASS=your_mongodb_password
```

4. **Run the server:**
```bash
python app.py
```

---

### ⚛️ Frontend Setup (React + Vite)

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```
   
3. **Run the frontend dev server:**

   ```bash
   npm run dev
   ```

   App will run at `http://localhost:5173`

---

### 📱 Mobile App (React Native)

```bash
cd sentra-vault
npm install

# Start Expo
npx expo start
```

Make sure you have the Expo Go app installed on your mobile device to preview the app.

---

### 💬 WhatsApp Server (Node.js)

```bash
cd whatsapp server
npm install

# Set environment variables
export WHATSAPP_TOKEN=your_token
export PHONE_NUMBER_ID=your_id

node app.js
```

---

## ✅ Usage Guide

1. **Login/Register** via the web or mobile app.
2. **Connect external sources** (GDrive, Notion, Dropbox).
3. Upload or ingest documents → system auto-tags them.
4. Use chat interface to query organizational knowledge.
5. Admins can monitor suspicious activity and get notified instantly.

---

## 🧪 Sample Use Cases

* 📁 A Sales Manager uploads multiple product documents → SentraVault tags them by department and restricts view to internal sales team only.
* 🧑‍🏫 An intern searches for onboarding guides → RAG pipeline filters confidential docs and shows beginner-accessible content.
* 🔐 A repeated failed access triggers a WhatsApp alert to the admin with user metadata and attempted document info.

---

## 🧑‍💻 Contributors

* **Haadi Rakhangi**
* **Hatim Mullajiwala**
* **Kush Kapadia**
* **Mehek Jain**

---
