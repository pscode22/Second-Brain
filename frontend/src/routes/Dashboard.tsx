import { useEffect, useState } from 'react';
import { GetContent } from '../services/api/content.api';
import { ContentType } from '../interfaces/constants';
import Card from '../components/ui/Card';
import { Content } from '../interfaces/generic';
import { useDeleteContent } from '../hooks/useDeleteContent';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setDelContent } = useDeleteContent();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        const res = await GetContent({ contentType: ContentType.ALL });
        if (res?.ok && Array.isArray(res.data)) {
          setContents(res.data);
        } else {
          const msg = res?.message || 'Failed to load content.';
          toast.error(msg);
          setError(msg);
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Something went wrong while fetching content.';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="border-muted-foreground h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-sm font-medium text-red-500">
        {error}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[70vh] items-center justify-center text-base font-medium">
        No contents found.
      </div>
    );
  }

  return (
    <div className="flex justify-center px-3 py-6 sm:px-6">
      <div className="grid w-full auto-rows-max gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contents.map((item) => (
          <Card
            key={item._id}
            id={item._id}
            title={item.title}
            link={item.link}
            type={item.contentType}
            deleteCard={() => setDelContent({ content: item, isModalOpen: true })}
          />
        ))}
      </div>
    </div>
  );
}
