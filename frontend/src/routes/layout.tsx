import { Suspense, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import { cn } from '../utils/cn';
import AddContentModal from '../features/dashboard/AddContentModal';
import DeleteContentModal from '../features/dashboard/DeleteContentModal';
import { Outlet, useLocation } from 'react-router-dom';
import { useDeleteContent } from '../hooks/useDeleteContent';
import Loader from '../components/ui/Loader';

export default function Layout() {
  //   const [contents, setContents] = useState<Content[]>([]);
  const [isMinSidebar, setIsMinSidebar] = useState<boolean>(false);
  // Add Content Modal
  const [isModalOpen, setModelOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsMinSidebar(!isMinSidebar);

  const { delContent, setDelContent } = useDeleteContent();

  const location = useLocation();

  const defaultPageLayout = location.pathname !== '/profile';

  return (
    <>
      <Sidebar isMinSidebar={isMinSidebar} toggleSidebar={toggleSidebar} />
      <Suspense fallback={<Loader className={isMinSidebar ? 'ml-16' : 'ml-64'} />}>
        <div
          className={cn(
            'min-h-screen bg-slate-100',
            isMinSidebar ? 'ml-16' : 'ml-64',
            defaultPageLayout && 'ps-14 pt-8 pr-10',
          )}
        >
          {defaultPageLayout && (
            <>
              <Header setModalOpen={setModelOpen} />
              <main className="mt-7 flex flex-wrap gap-3">
                <Outlet />
              </main>
            </>
          )}
          {!defaultPageLayout && <Outlet />}
          <AddContentModal isModalOpen={isModalOpen} setModalOpen={setModelOpen} />
          <DeleteContentModal
            isModalOpen={delContent.isModalOpen}
            closeModal={() => setDelContent({ isModalOpen: false })}
            content={delContent.content || null}
          />
        </div>
      </Suspense>
    </>
  );
}
