import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import { cn } from '../utils/cn';
import AddContentModal from '../features/dashboard/AddContentModal';
import { GetContent } from '../services/api/content.api';
import { Content } from '../interfaces/generic';
import DeleteContentModal from '../features/dashboard/DeleteContentModal';

export default function Dashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isMinSidebar, setIsMinSidebar] = useState<boolean>(false);
  // Add Content Modal
  const [isModalOpen, setModelOpen] = useState<boolean>(false);

  // Delete Content Modal
  const [delContent, setDelContent] = useState<{
    content?: Content;
    isModalOpen: boolean;
  }>({ isModalOpen: false });

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
        <main className="mt-7 flex gap-3 flex-wrap">
          {contents.map((item) => (
            <Card
              type={item.contentType}
              title={item.title}
              link={item.link}
              id={item._id}
              key={item._id}
              deleteCard={() => setDelContent({ content: item, isModalOpen: true })}
            />
          ))}
        </main>
        <AddContentModal isModalOpen={isModalOpen} setModalOpen={setModelOpen} />
        <DeleteContentModal
          isModalOpen={delContent.isModalOpen}
          closeModal={() => setDelContent({ isModalOpen: false })}
          content={delContent.content || null}
        />
      </div>
    </>
  );
}
