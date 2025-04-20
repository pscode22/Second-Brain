import SideArrowIcon from '../../icons/SideArrowIcon';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isMinSidebar: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isMinSidebar, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed h-screen border border-[#e2e1e4] bg-white transition-all duration-400',
        isMinSidebar ? 'w-16 p-1' : 'w-64 px-3 py-1',
      )}
    >
      <div className={cn('relative flex h-full w-full flex-col')}>
        <footer
          className={cn(
            'transition- absolute right-0 bottom-0 flex w-full transition-discrete duration-400',
            isMinSidebar ? 'justify-center' : 'justify-end',
          )}
        >
          <button
            className="cursor-pointer rounded-md bg-purple-600 p-2 text-white"
            onClick={toggleSidebar}
          >
            <SideArrowIcon isLeft={isMinSidebar} />
          </button>
        </footer>
      </div>
    </aside>
  );
}
