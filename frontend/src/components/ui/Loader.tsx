import { FiLoader } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export default function Loader({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-screen items-center justify-center bg-gray-100', className)}>
      <FiLoader className="animate-spin text-4xl text-purple-600" />
    </div>
  );
}
