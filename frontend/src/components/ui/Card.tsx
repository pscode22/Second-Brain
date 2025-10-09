import { useState } from "react";
import { Tweet } from "react-tweet";
import { iconStyle } from "../../constants/iconStyle";
import DeleteIcon from "../../icons/DeleteIcon";
import TwitterIcon from "../../icons/TwitterIcon";
import YoutubeIcon from "../../icons/YoutubeIcon";
import { ContentType } from "../../interfaces/constants";
import { getTweetId } from "../../utils/utils";

interface CardProps {
  id?: string;
  type: ContentType;
  title: string;
  link: string;
  deleteCard: () => void;
  isDelete?: boolean;
}

export default function Card({
  type,
  title,
  link,
  deleteCard,
  isDelete = true,
}: CardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // 🎯 Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&"'>]+)/
    );
    return match ? match[1] : "";
  };

  const videoId = getYouTubeId(link);

  return (
    <div
      className="
        w-full bg-white rounded-xl shadow-sm
        hover:shadow-md transition-all
        border border-gray-100
        p-4 flex flex-col gap-3
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === ContentType.YOUTUBE && <YoutubeIcon style={iconStyle} />}
          {type === ContentType.TWITTER && <TwitterIcon style={iconStyle} />}
          <p className="text-sm font-medium text-gray-900 truncate">
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </p>
        </div>

        {isDelete && (
          <button
            onClick={deleteCard}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <DeleteIcon style={iconStyle} />
          </button>
        )}
      </div>

      {/* Content Area with Scroll Cap */}
      <div
        className="
          relative w-full overflow-y-auto rounded-lg
          max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
        "
      >
        {type === ContentType.YOUTUBE && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            {!isPlaying ? (
              <>
                {/* Thumbnail Preview */}
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt={title}
                  className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
                  onClick={() => setIsPlaying(true)}
                  loading="lazy"
                />
                {/* Play Button Overlay */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Play video"
                >
                  <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-red-500"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              </>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={title}
                className="w-full h-full rounded-lg border border-gray-100"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        )}

        {type === ContentType.TWITTER && (
          <div className="rounded-md overflow-hidden">
            <Tweet id={getTweetId(link)} />
          </div>
        )}
      </div>
    </div>
  );
}
