import { useEffect, useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { HiHashtag } from 'react-icons/hi';
import { CgProfile } from 'react-icons/cg';
import SideArrowIcon from '../../icons/SideArrowIcon';
import { cn } from '../../utils/cn';
import SidebarItem from './SidebarItem';
import { ActiveSidebarItem } from '../../interfaces/constants';
import { useNavigate } from 'react-router-dom';
import { useUserName } from '../../hooks/useUserName';
import BrainIcon from '../../icons/BrainIcon';

interface SidebarProps {
  isMinSidebar: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isMinSidebar, toggleSidebar }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<ActiveSidebarItem>(
    () => (localStorage.getItem('activeSidebarItem') as ActiveSidebarItem) || ActiveSidebarItem.ALL,
  );

  const userName = useUserName();
  const navigate = useNavigate();

  // ✅ Persist active item to localStorage
  useEffect(() => {
    localStorage.setItem('activeSidebarItem', activeItem);
  }, [activeItem]);

  const handleItemClick = (item: ActiveSidebarItem, path: string) => {
    setActiveItem(item);
    navigate(path);
  };

  return (
    <aside
      className={cn(
        'fixed z-40 h-screen border border-[#e2e1e4] bg-white px-3 pb-1 shadow-sm transition-all duration-300 ease-in-out',
        isMinSidebar ? 'w-20' : 'w-64',
      )}
    >
      <div className="flex h-full flex-col pt-5">
        {/* === Header === */}
        <div className={cn('mb-10 inline-flex w-full px-3', !isMinSidebar && 'items-center gap-3')}>
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center transition-transform hover:scale-110 hover:cursor-pointer"
            >
              <BrainIcon style={{ width: '2rem', height: '2rem', margin: '0' }} />
            </button>
          </div>
          <h3
            className={cn(
              'm-0 text-start text-xl font-bold whitespace-nowrap text-[#202b3c] duration-200',
              isMinSidebar && 'scale-0',
            )}
          >
            Second Brain
          </h3>
        </div>

        {/* === Main Links === */}
        <div className="flex grow flex-col justify-between">
          <div>
            {/* All */}
            <SidebarItem
              icon={
                <HiHashtag
                  size="2rem"
                  color={activeItem === ActiveSidebarItem.ALL ? '#463ad6' : '#99a1af'}
                />
              }
              title="All"
              iconOnly={isMinSidebar}
              onClick={() => handleItemClick(ActiveSidebarItem.ALL, '/dashboard')}
              isActive={activeItem === ActiveSidebarItem.ALL}
            />

            <br />

            {/* Twitter */}
            <SidebarItem
              icon={
                <FaSquareXTwitter
                  size="2rem"
                  color={activeItem === ActiveSidebarItem.TWITTER ? '#463ad6' : '#99a1af'}
                />
              }
              title="Twitter"
              iconOnly={isMinSidebar}
              onClick={() => handleItemClick(ActiveSidebarItem.TWITTER, '/twitter')}
              isActive={activeItem === ActiveSidebarItem.TWITTER}
            />

            <br />

            {/* YouTube */}
            <SidebarItem
              icon={
                <FaYoutube
                  size="2rem"
                  color={activeItem === ActiveSidebarItem.YOUTUBE ? '#463ad6' : '#99a1af'}
                />
              }
              title="YouTube"
              iconOnly={isMinSidebar}
              onClick={() => handleItemClick(ActiveSidebarItem.YOUTUBE, '/youtube')}
              isActive={activeItem === ActiveSidebarItem.YOUTUBE}
            />
          </div>

          {/* === Footer === */}
          <footer
            className={cn(
              'mb-2 flex transition-all duration-300',
              isMinSidebar ? 'flex-col items-center gap-3' : 'flex-row gap-2',
            )}
          >
            {/* Profile */}
            <SidebarItem
              icon={
                <CgProfile
                  size="2rem"
                  color={activeItem === ActiveSidebarItem.PROFILE ? '#463ad6' : '#99a1af'}
                />
              }
              title={userName || 'Profile'}
              iconOnly={isMinSidebar}
              onClick={() => handleItemClick(ActiveSidebarItem.PROFILE, '/profile')}
              isActive={activeItem === ActiveSidebarItem.PROFILE}
              className={cn(isMinSidebar ? '' : 'mb-0 p-1 ps-3')}
            />

            {/* Toggle button */}
            <div className="mx-auto">
              <button
                className="cursor-pointer rounded-md bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700"
                onClick={toggleSidebar}
              >
                <SideArrowIcon isLeft={isMinSidebar} />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </aside>
  );
}
