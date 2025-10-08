import { useEffect, useState } from 'react';
import { GetContent } from '../services/api/content.api';
import { ContentType } from '../interfaces/constants';
import Card from '../components/ui/Card';
import { Content } from '../interfaces/generic';
import { useDeleteContent } from '../hooks/useDeleteContent';

export default function Dashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const { setDelContent } = useDeleteContent();

  useEffect(() => {
    const getContent = async () => {
      const contents = await GetContent({ contentType: ContentType.ALL });
      setContents(contents.data);
    };
    getContent();
  }, []);

  return (
    <>
      {contents.length > 0 &&
        contents.map((item) => (
          <Card
            type={item.contentType}
            title={item.title}
            link={item.link}
            id={item._id}
            key={item._id}
            deleteCard={() => setDelContent({ content: item, isModalOpen: true })}
          />
        ))}
      {contents.length === 0 && (
        <div className="mt-10 w-full text-center text-xl font-medium">No Contents found.</div>
      )}
    </>
  );
}
