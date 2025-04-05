import Sidebar from "../components/Sidebar";
import ChatContent from "../components/ChatContent";

function ChatInterface() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <ChatContent />
    </div>
  );
}

export default ChatInterface;
