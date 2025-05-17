import { Tweet } from 'react-tweet';
import { iconStyle } from '../../constants/iconStyle';
import DeleteIcon from '../../icons/DeleteIcon';
import ShareIcon from '../../icons/ShareIcon';
import TwitterIcon from '../../icons/TwitterIcon';
import YoutubeIcon from '../../icons/YoutubeIcon';
import { ContentType } from '../../interfaces/constants';
import { getTweetId, normalizeYouTubeUrl } from '../../utils/utils';

interface CardProps {
  id?: string;
  type: ContentType;
  title: string;
  link: string;
  deleteCard: () => void;
}

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load?: () => void;
        createTweet?: (
          tweetId: string,
          element: HTMLElement,
          options?: Record<string, unknown>,
        ) => Promise<unknown>;
      };
    };
  }
}

export default function Card(props: CardProps) {
  const { type, title, link, deleteCard } = props;

  return (
    <div className="flex w-xs flex-col gap-2 rounded-md border border-[#e2e1e4] bg-white p-4">
      {/* Header */}
      <div className="align-items-center flex w-full justify-between">
        <div className="flex items-center gap-2">
          {type === ContentType.YOUTUBE && <YoutubeIcon style={iconStyle} />}
          {type === ContentType.TWITTER && <TwitterIcon style={iconStyle} />}
          <p className="m-0 text-[.875rem] font-medium">
            {title['0'].toUpperCase() + title.slice(1)}
          </p>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <ShareIcon style={iconStyle} />
          <button onClick={() => deleteCard()}>
            <DeleteIcon style={iconStyle} />
          </button>
        </div>
      </div>

      {/* main */}
      <div className="white max-h-[164px] w-full overflow-auto">
        {type === ContentType.YOUTUBE && (
          <iframe
            className="mt-3 w-full rounded"
            src={normalizeYouTubeUrl(link)}
            title="YouTube video player"
            // frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}

        {type === ContentType.TWITTER && <Tweet id={getTweetId(link)} />}
      </div>
    </div>
  );
}
