import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import RightPanel from "../components/Right";
function Home() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <MainContent />
      <RightPanel />
    </div>
  );
}

export default Home;
