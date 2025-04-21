import { Dispatch, SetStateAction } from 'react';
import { Modal } from './ui/Modal';

interface ContentCreateModalProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ContentCreateModel({ isModalOpen, setModalOpen }: ContentCreateModalProps) {
  return (
    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create Content">
      <p className="mb-4">This is your modal content.</p>
      <button
        onClick={() => setModalOpen(false)}
        className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        Close
      </button>
    </Modal>
  );
}
