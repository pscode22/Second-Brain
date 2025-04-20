import { iconStyle } from '../../constants/iconStyle';
import DeleteIcon from '../../icons/DeleteIcon';
import ShareIcon from '../../icons/ShareIcon';
import TwitterIcon from '../../icons/TwitterIcon';
import YoutubeIcon from '../../icons/YoutubeIcon';

interface CardProps {
  type: 'youtube' | 'twitter';
  title: string;
  link: string;
}

function normalizeYouTubeUrl(url: string): string {
  return (
    url
      // 1) youtu.be/ID → www.youtube.com/embed/ID
      .replace(
        /^https?:\/\/youtu\.be\/([^?]+)/,
        (_m, id) => `https://www.youtube.com/embed/${id}`
      )
      // 2) youtube.com/watch?v=ID → www.youtube.com/embed/ID
      .replace(
        /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^?&]+)/,
        (_m, id) => `https://www.youtube.com/embed/${id}`
      )
      // 3) only the first "?…=" → "/"
      .replace(/\?[^=]*=/, '/')
  );
}

export default function Card(props: CardProps) {
  const { type, title, link } = props;
  return (
    <div className="flex flex-col gap-2 border border-[#e2e1e4] w-xs p-4 rounded-md bg-white">
      {/* Header */}
      <div className="flex w-full justify-between">
        <div className="flex gap-2 items-center">
          {type === 'youtube' && <YoutubeIcon style={iconStyle} />}
          {type === 'twitter' && <TwitterIcon style={iconStyle} />}
          <p className="m-0 text-[.875rem] font-medium">
            {title['0'].toUpperCase() + title.slice(1)}
          </p>
        </div>
        <div className="flex gap-3 items-center text-gray-400">
          <ShareIcon style={iconStyle} />
          <DeleteIcon style={iconStyle} />
        </div>
      </div>

      {/* main */}
      <div className="w-full">
        {type === 'youtube' && (
          <iframe
            className="w-full rounded mt-3"
            src={normalizeYouTubeUrl(link)}
            title="YouTube video player"
            // frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}

        {type === 'twitter' && (
          <blockquote className="twitter-tweet w-3xs">
            <a href={link.replace('x', 'twitter')} target="_blank" />
          </blockquote>
        )}
      </div>
    </div>
  );
}
