import { useState } from 'react';
import Card from '../components/ui/Card';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import { cn } from '../utils/cn';
import AddContentModal from '../features/dashboard/AddContentModal';
// import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const [isMinSidebar, setIsMinSidebar] = useState<boolean>(false);
  const [isModalOpen, setModelOpen] = useState<boolean>(false);
  const toggleSidebar = () => setIsMinSidebar(!isMinSidebar);

  return (
    <>
      <Sidebar isMinSidebar={isMinSidebar} toggleSidebar={toggleSidebar} />
      <div
        className={cn(
          'min-h-screen bg-slate-100 ps-14 pt-8 pr-10 transition-all duration-400',
          isMinSidebar ? 'ml-16' : 'ml-64',
        )}
      >
        <Header setModalOpen={setModelOpen} />
        <main className="mt-7 flex gap-3">
          <Card
            type="twitter"
            title="first tweet"
            link={'https://x.com/kirat_tw/status/1633685473821425666'}
          />
          <Card
            type="youtube"
            title="Harkirat video"
            link={'https://www.youtube.com/watch?v=ldAV_bixqaw'}
          />
        </main>
        <AddContentModal isModalOpen={isModalOpen} setModalOpen={setModelOpen} />
      </div>
    </>
  );
}
