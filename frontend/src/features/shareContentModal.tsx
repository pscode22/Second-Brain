import { useState } from 'react';
import { Modal } from '../components/ui/Modal';

interface CopyLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
}

export function ShareContentModal({ isOpen, onClose, link }: CopyLinkModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share this link">
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={link}
            readOnly
            className="w-full rounded-md border border-gray-300 px-4 py-2 pr-28 text-sm shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md bg-purple-600 px-3 py-1.5 text-sm text-white transition hover:bg-[#5940f1]"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="ps-[0.2px] text-xs text-gray-500">
          Invite others into your second brain — copy and share the link.
        </p>
      </div>
    </Modal>
  );
}
