import { Tweet } from 'react-tweet';
import { iconStyle } from '../../constants/iconStyle';
import DeleteIcon from '../../icons/DeleteIcon';
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
  isDelete?: boolean;
}

export default function Card(props: CardProps) {
  const { type, title, link, deleteCard, isDelete = true } = props;

  return (
    <div className="flex w-[350px] flex-col gap-2 rounded-md border border-[#e2e1e4] bg-white p-4">
      {/* Header */}
      <div className="align-items-center flex w-full justify-between">
        <div className="flex items-center gap-2">
          {type === ContentType.YOUTUBE && <YoutubeIcon style={iconStyle} />}
          {type === ContentType.TWITTER && <TwitterIcon style={iconStyle} />}
          <p className="m-0 text-[.875rem] font-medium">
            {title['0'].toUpperCase() + title.slice(1)}
          </p>
        </div>

        {isDelete && (
          <button onClick={deleteCard} className="text-gray-400">
            <DeleteIcon style={iconStyle} />
          </button>
        )}
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
