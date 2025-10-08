import { Tweet } from 'react-tweet';
import { Modal } from '../components/ui/Modal';
import { ContentType } from '../interfaces/constants';
import { Content } from '../interfaces/generic';
import { getTweetId, normalizeYouTubeUrl } from '../utils/utils';
import { MouseEventHandler } from 'react';
import { DeleteContent } from '../services/api/content.api';
import { useNavigate } from 'react-router-dom';

interface DeleteContentProps {
  isModalOpen: boolean;
  content: Content | null;
  closeModal: () => void;
}

const btnBaseClasses = 'px-4 py-2 font-medium text-sm rounded-md focus:outline-none cursor-pointer';

const variantClasses = {
  cancel:
    'bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 focus:ring-gray-400 disabled:opacity-50 disabled:pointer-events-none',
  delete:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:opacity-90 disabled:opacity-50 disabled:pointer-events-none',
};

export default function DeleteContentModal({
  isModalOpen,
  closeModal,
  content,
}: DeleteContentProps) {
  const navigate = useNavigate();
  const onDeleteContent: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (!content?._id) {
      return;
    }

    try {
      await DeleteContent({ contentId: content._id });
      navigate(0);
    } catch (error) {
      const { log } = console;
      log(error);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        closeModal();
      }}
      title="Delete Note"
    >
      Want to delete {content?.title}?{/* <button className=''>Delete</button> */}
      <div className="max-h-[450px] w-full overflow-auto">
        {content?.contentType === ContentType.YOUTUBE && (
          <iframe
            className="mt-3 w-full rounded"
            src={normalizeYouTubeUrl(content.link)}
            title="YouTube video player"
            // frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}

        {content?.contentType === ContentType.TWITTER && <Tweet id={getTweetId(content.link)} />}
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          className={`${btnBaseClasses} ${variantClasses['cancel']}`}
          onClick={closeModal}
          aria-label="Cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          className={`${btnBaseClasses} ${variantClasses['delete']}`}
          onClick={onDeleteContent}
          // disabled={disabled}
          aria-label="Delete"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
