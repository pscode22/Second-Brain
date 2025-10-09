import { useEffect, useState } from "react";
import { GetContent } from "../services/api/content.api";
import { ContentType } from "../interfaces/constants";
import Card from "../components/ui/Card";
import { Content } from "../interfaces/generic";
import { useDeleteContent } from "../hooks/useDeleteContent";
import { toast } from "react-hot-toast";

export default function Youtube() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setDelContent } = useDeleteContent();

  useEffect(() => {
    const fetchYouTube = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await GetContent({ contentType: ContentType.YOUTUBE });

        if (res?.ok && Array.isArray(res.data)) {
          setContents(res.data);
        } else {
          const msg = res?.message || "Failed to load YouTube videos.";
          setError(msg);
          toast.error(msg);
        }
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Something went wrong while fetching YouTube videos.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchYouTube();
  }, []);

  // 🌀 Loader
  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading YouTube videos...</p>
        </div>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center px-4">
        <p className="text-red-500 text-sm font-medium text-center max-w-sm">
          {error}
        </p>
      </div>
    );
  }

  // 📝 Empty state
  if (contents.length === 0) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center px-4">
        <p className="text-muted-foreground text-base font-medium text-center">
          No YouTube videos found.
        </p>
      </div>
    );
  }

  // ✅ Main content grid
  return (
    <div className="flex justify-center px-3 py-6 sm:px-6">
      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max">
        {contents.map((item) => (
          <Card
            key={item._id}
            id={item._id}
            title={item.title}
            link={item.link}
            type={item.contentType}
            deleteCard={() =>
              setDelContent({ content: item, isModalOpen: true })
            }
          />
        ))}
      </div>
    </div>
  );
}
