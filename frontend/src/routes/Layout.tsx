import { Suspense, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import { cn } from '../utils/cn';
import AddContentModal from '../features/AddContentModal';
import DeleteContentModal from '../features/DeleteContentModal';
import { Outlet, useLocation } from 'react-router-dom';
import { useDeleteContent } from '../hooks/useDeleteContent';
import Loader from '../components/ui/Loader';
import { useShareContent } from '../hooks/useShareContent';
import { ShareContentModal } from '../features/shareContentModal';

export default function Layout() {
  const [isMinSidebar, setIsMinSidebar] = useState(false);
  const [isModalOpen, setModelOpen] = useState(false);

  const toggleSidebar = () => setIsMinSidebar(!isMinSidebar);
  const { delContent, setDelContent } = useDeleteContent();
  const { shareContent, setShareContent } = useShareContent();

  const location = useLocation();
  const defaultPageLayout = location.pathname !== '/profile';

  return (
    <>
      <Sidebar isMinSidebar={isMinSidebar} toggleSidebar={toggleSidebar} />
      <Suspense fallback={<Loader className={isMinSidebar ? 'ml-16' : 'ml-64'} />}>
        <div
          className={cn(
            // ✅ allow full natural page scroll — no overflow restriction
            'min-h-screen bg-slate-100',
            isMinSidebar ? 'ml-16' : 'ml-64',
            defaultPageLayout && 'ps-14 pt-8 pr-10'
          )}
        >
          {defaultPageLayout ? (
            <>
              <Header setModalOpen={setModelOpen} />
              <main className="mt-7 flex flex-wrap gap-3">
                <Outlet />
              </main>
            </>
          ) : (
            <Outlet />
          )}

          {/* Modals */}
          <AddContentModal isModalOpen={isModalOpen} setModalOpen={setModelOpen} />
          <DeleteContentModal
            isModalOpen={delContent.isModalOpen}
            closeModal={() => setDelContent({ isModalOpen: false })}
            content={delContent.content || null}
          />
          <ShareContentModal
            isOpen={shareContent.isModalOpen}
            onClose={() => setShareContent({ isModalOpen: false })}
            link={shareContent.shareableLink || ''}
          />
        </div>
      </Suspense>
    </>
  );
}
