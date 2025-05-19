import { useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import SideArrowIcon from '../../icons/SideArrowIcon';
import { HiHashtag } from 'react-icons/hi';
import { cn } from '../../utils/cn';
import SidebarItem from './SidebarItem';
import { ActiveSidebarItem } from '../../interfaces/constants';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { LuBrain } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isMinSidebar: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isMinSidebar, toggleSidebar }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<ActiveSidebarItem>(ActiveSidebarItem.ALL);
  const navigate = useNavigate();
  return (
    <aside
      className={cn(
        'fixed h-screen border border-[#e2e1e4] bg-white px-3 pb-1 transition-all duration-400 ease-in-out',
        isMinSidebar ? 'w-20' : 'w-64',
      )}
    >
      <div className="relative h-full pt-5">
        <div className={cn('mb-10 inline-flex w-full px-3', !isMinSidebar && 'items-center gap-3')}>
          <div>
            <LuBrain size={'2rem'} color="#463ad6" className="hover:cursor-pointer" />
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
        <div>
          <SidebarItem
            icon={
              <HiHashtag
                size="2rem"
                color={activeItem === ActiveSidebarItem.ALL ? '#463ad6' : '#99a1af'}
              />
            }
            title="All"
            iconOnly={isMinSidebar}
            onClick={() => {
              setActiveItem(ActiveSidebarItem.ALL);
              navigate('/dashboard');
            }}
            isActive={activeItem === ActiveSidebarItem.ALL}
          />
          <br />
          <SidebarItem
            icon={
              <FaSquareXTwitter
                size="2rem"
                color={activeItem === ActiveSidebarItem.TWITTER ? '#463ad6' : '#99a1af'}
              />
            }
            title="Twitter"
            iconOnly={isMinSidebar}
            onClick={() => {
              setActiveItem(ActiveSidebarItem.TWITTER);
              navigate('/twitter');
            }}
            isActive={activeItem === ActiveSidebarItem.TWITTER}
          />
          <br />
          <SidebarItem
            icon={
              <FaYoutube
                size="2rem"
                color={activeItem === ActiveSidebarItem.YOUTUBE ? '#463ad6' : '#99a1af'}
              />
            }
            title="Youtube"
            iconOnly={isMinSidebar}
            onClick={() => {
              setActiveItem(ActiveSidebarItem.YOUTUBE);
              navigate('/youtube')
            }}
            isActive={activeItem === ActiveSidebarItem.YOUTUBE}
          />
        </div>
        <footer
          className={cn(
            'absolute bottom-0 transition-discrete duration-500',
            isMinSidebar ? 'right-2' : 'right-0',
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
