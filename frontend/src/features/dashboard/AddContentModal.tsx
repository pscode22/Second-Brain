import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import InputField from '../../components/ui/InputField';
import ContentTypeButton from './ContentTypeBtn';
import { ContentType } from '../../interfaces/constants';

interface ContentCreateModalProps {
  isModalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ContentCreateModel({ isModalOpen, setModalOpen }: ContentCreateModalProps) {
  const contentTitleRef = useRef<HTMLInputElement>(null);
  const contentLinkRef = useRef<HTMLInputElement>(null);
  const [contentType, setContentType] = useState<ContentType>(ContentType.NONE);
  return (
    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add Content" >
      <div className="flex flex-col gap-3">
        <InputField
          type="text"
          placeholder="Content title"
          labelName="Title"
          ref={contentTitleRef}
          nameAttr="title"
        />

        <InputField
          type="text"
          placeholder="Content link"
          labelName="Link"
          ref={contentLinkRef}
          nameAttr="link"
        />

        <div className="w-full">
          <label className="mb-1 block font-medium">Type</label>
          <div className="flex w-full gap-3">
            <ContentTypeButton
              text="Youtube"
              className={`w-1/2 ${contentType === ContentType.YOUTUBE && 'bg-purple-600 text-white'}`}
              onClick={() => setContentType(ContentType.YOUTUBE)}
            />
            <ContentTypeButton
              text="Twitter"
              className={`w-1/2 ${contentType === ContentType.TWITTER && 'bg-purple-600 text-white'}`}
              onClick={() => setContentType(ContentType.TWITTER)}
            />
          </div>
        </div>
      </div>
      <br />

      <button
        // onClick={() => setModalOpen(false)}
        className="w-full rounded bg-purple-600 px-4 py-2 text-white font-medium cursor-pointer"
      >
        Add
      </button>
    </Modal>
  );
}
