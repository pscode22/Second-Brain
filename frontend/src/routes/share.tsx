import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { LuBrain } from 'react-icons/lu';
import { useLayoutEffect, useState } from 'react';
import { Content } from '../interfaces/generic';
import { GetAllContentsByShareLink } from '../services/api/content.api';
import Card from '../components/ui/Card';
import { AxiosError } from 'axios';

export default function Share() {
  const navigate = useNavigate();
  const params = useParams();

  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isErr, setIsErr] = useState<{ err: boolean; errMsg?: string }>({ err: false });

  useLayoutEffect(() => {
    const getContent = async () => {
      setIsLoading(true);
      try {
        const contents = await GetAllContentsByShareLink({ shareLink: params.shareLink || '' });
        console.log(contents);
        if (contents) {
          setContents(contents.contents);
        } else {
          setContents([]);
        }
      } catch (error) {
        console.log(error);
        setIsErr({
          err: true,
          errMsg:
            ((error as AxiosError).response?.data as { message: string }).message ||
            'Something went wrong',
        });
      } finally {
        setIsLoading(false);
      }
    };
    getContent();
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-100 px-14 pt-8">
      <header className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-3 px-3">
          <div>
            <LuBrain size={'2rem'} color="#463ad6" className="hover:cursor-pointer" />
          </div>
          <h3 className="m-0 text-start text-2xl font-bold whitespace-nowrap text-[#202b3c] duration-200">
            Second Brain
          </h3>
        </div>

        <Button
          variant="primary"
          text="Sign Up"
          onClick={() => navigate('/signin')}
          className="pb-3"
        />
      </header>

      <main className="mt-7 flex flex-wrap gap-3">
        {!isLoading && (
          <>
            {isErr.err && (
              <div className="mt-10 w-full text-center text-xl font-medium text-red-600">
                Error : {isErr.errMsg || 'Something went wrong'}
              </div>
            )}
            {!isErr.err && (
              <>
                {contents.length === 0 && (
                  <div className="mt-10 w-full text-center text-xl font-medium">
                    No Contents found.
                  </div>
                )}
                {contents.length > 0 &&
                  contents.map((item) => (
                    <Card
                      type={item.contentType}
                      title={item.title}
                      link={item.link}
                      id={item._id}
                      key={item._id}
                      deleteCard={() => {}}
                      isDelete={false}
                    />
                  ))}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
