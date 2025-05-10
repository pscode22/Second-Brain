import { MouseEventHandler } from 'react';
import { cn } from '../../utils/cn';

interface AddContentModalButton {
  text: string;
  className : HTMLButtonElement['className'];
  onClick : MouseEventHandler<HTMLButtonElement>
}

export default function ContentTypeButton({ text, className, onClick }: AddContentModalButton) {
  return (
    <button
      className={cn(
        'text-center cursor-pointer  gap-2 rounded-md border-0 bg-gray-200 px-4 py-2 font-normal outline-0',
        className
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
