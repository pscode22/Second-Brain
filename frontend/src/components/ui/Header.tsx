import { Dispatch, SetStateAction, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { iconStyle } from "../../constants/iconStyle";
import PlusIcon from "../../icons/PlusIcon";
import ShareIcon from "../../icons/ShareIcon";
import { Button } from "../ui/Button";
import { useShareContent } from "../../hooks/useShareContent";
import { GetShareableLink } from "../../services/api/generic.api";
import { toast } from "react-hot-toast";

interface HeaderProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setModalOpen }: HeaderProps) {
  const { setShareContent } = useShareContent();
  const location = useLocation();

  // 🧠 Dynamic heading based on route
  const pageTitle = useMemo(() => {
    if (location.pathname.includes("/twitter")) return "Twitter Notes";
    if (location.pathname.includes("/youtube")) return "YouTube Notes";
    if (location.pathname.includes("/dashboard")) return "All Notes";
    return "Notes";
  }, [location.pathname]);

  // 🔗 Handle Share Brain button
  const onShare = async () => {
    try {
      const link = await GetShareableLink();

      if (link && link.sharableLink) {
        setShareContent({
          isModalOpen: true,
          shareableLink: `http://localhost:5173/share/${link.sharableLink}`,
        });
        toast.success("Share link generated successfully!");
      } else {
        toast.error("Failed to create share link.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating share link.");
    }
  };

  return (
    <header className="flex items-end justify-between gap-3">
      <h1 className="mb-0 text-[1.6rem] font-bold text-[#202b3c] transition-all">
        {pageTitle}
      </h1>
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
