import { MouseEventHandler, ReactElement, SVGProps } from 'react';
import { cn } from '../../utils/cn';

interface SidebarItem {
  icon: ReactElement<SVGProps<SVGSVGElement>>;
  title: string;
  iconOnly: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
}

export default function SidebarItem({ icon, title, iconOnly, onClick, isActive }: SidebarItem) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'mb-4 inline-flex w-full cursor-pointer items-center rounded p-3 whitespace-nowrap transition-discrete duration-50',
        iconOnly && 'justify-center',
        !iconOnly && 'gap-3',
        isActive && 'bg-[#d9ddee] text-purple-600',
      )}
    >
      <div>{icon}</div>
      <p
        className={cn(
          'text-md m-0 text-start font-medium whitespace-nowrap text-[#202b3c] transition-discrete duration-50',
          iconOnly && 'hidden scale-0',
        )}
      >
        {title}
      </p>
    </button>
  );
}
