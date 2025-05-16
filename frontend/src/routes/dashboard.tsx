import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import { cn } from '../utils/cn';
import AddContentModal from '../features/dashboard/AddContentModal';
import { GetContent } from '../services/api/content.api';
import { Content } from '../interfaces/generic';

export default function Dashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isMinSidebar, setIsMinSidebar] = useState<boolean>(false);
  const [isModalOpen, setModelOpen] = useState<boolean>(false);
  const toggleSidebar = () => setIsMinSidebar(!isMinSidebar);

  useEffect(() => {
    const getContent = async () => {
      const contents = await GetContent();
      setContents(contents.data);
    };
    getContent();
  }, []);

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
          {contents.map((item) => (
            <Card type={item.contentType} title={item.title} link={item.link} key={item._id} />
          ))}
        </main>
        <AddContentModal isModalOpen={isModalOpen} setModalOpen={setModelOpen} />
      </div>
    </>
  );
}
