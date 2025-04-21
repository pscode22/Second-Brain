import { Dispatch, SetStateAction } from 'react';
import { iconStyle } from '../../constants/iconStyle';
import PlusIcon from '../../icons/PlusIcon';
import ShareIcon from '../../icons/ShareIcon';
import { Button } from '.././ui/Button';

interface HeaderProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setModalOpen }: HeaderProps) {
  return (
    <header className="flex items-end justify-between gap-3">
      <h1 className="mb-0 text-[1.6rem] font-bold">All Notes</h1>
      <div className="flex gap-3">
        <Button
          variant="secondary"
          text="Share Brain"
          startIcon={<ShareIcon style={iconStyle} />}
        />
        <Button
          variant="primary"
          text="Add Content"
          startIcon={<PlusIcon style={iconStyle} />}
          onClick={() => setModalOpen(true)}
        />
      </div>
    </header>
  );
}
