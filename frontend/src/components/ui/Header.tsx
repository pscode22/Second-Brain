import { Dispatch, SetStateAction } from 'react';
import { iconStyle } from '../../constants/iconStyle';
import PlusIcon from '../../icons/PlusIcon';
import ShareIcon from '../../icons/ShareIcon';
import { Button } from '.././ui/Button';
import { useShareContent } from '../../hooks/useShareContent';
import { GetShareableLink } from '../../services/api/generic.api';

interface HeaderProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setModalOpen }: HeaderProps) {
  const { setShareContent } = useShareContent();

  const onShare = async () => {
    try {
      const link: { sharableLink: string } = await GetShareableLink();

      if (link && link.sharableLink) {
        setShareContent({
          isModalOpen: true,
          shareableLink: `http://localhost:5173/share/${link.sharableLink}`,
        });
      }
    } catch (error) {
      const { log } = console;
      log(error);
    }
  };

  return (
    <header className="flex items-end justify-between gap-3">
      <h1 className="mb-0 text-[1.6rem] font-bold">All Notes</h1>
      <div className="flex gap-3">
        <Button
          variant="secondary"
          text="Share Brain"
          startIcon={<ShareIcon style={iconStyle} />}
          onClick={onShare}
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
