import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";

function ChatInterface() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default ChatInterface;
