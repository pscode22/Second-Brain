import { useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import { cn } from '../utils/cn';
import AddContentModal from '../features/dashboard/AddContentModal';
import DeleteContentModal from '../features/dashboard/DeleteContentModal';
import { Outlet } from 'react-router-dom';
import { useDeleteContent } from '../hooks/useDeleteContent';

export default function Layout() {
  //   const [contents, setContents] = useState<Content[]>([]);
  const [isMinSidebar, setIsMinSidebar] = useState<boolean>(false);
  // Add Content Modal
  const [isModalOpen, setModelOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsMinSidebar(!isMinSidebar);

  const { delContent, setDelContent } = useDeleteContent();

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
        <main className="mt-7 flex flex-wrap gap-3">
          <Outlet />
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
