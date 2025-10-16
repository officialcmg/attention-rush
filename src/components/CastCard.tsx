import { useEffect, useRef, useState } from 'react';
import { Heart, Repeat2, MessageCircle, ExternalLink } from 'lucide-react';
import { FarcasterCast } from '../types';

interface CastCardProps {
  cast: FarcasterCast;
  onFullyVisible: (cast: FarcasterCast) => void;
  onClick: (cast: FarcasterCast) => void;
  isPaid: boolean;
}

export function CastCard({ cast, onFullyVisible, onClick, isPaid }: CastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!cardRef.current || hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if card is 100% visible
          if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
            setHasTriggered(true);
            onFullyVisible(cast);
          }
        });
      },
      {
        threshold: 1.0, // Trigger when 100% visible
      }
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [cast, onFullyVisible, hasTriggered]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(cast)}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border-2 ${
        isPaid ? 'border-green-400 bg-green-50' : 'border-transparent'
      }`}
    >
      <div className="flex items-start gap-4">
        <img
          src={cast.author.pfp_url || 'https://via.placeholder.com/48'}
          alt={cast.author.display_name}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">
              {cast.author.display_name}
            </span>
            <span className="text-gray-500 text-sm">
              @{cast.author.username}
            </span>
            <span className="text-gray-400 text-sm">
              · {formatTimestamp(cast.timestamp)}
            </span>
          </div>
          
          <p className="mt-2 text-gray-800 whitespace-pre-wrap">
            {cast.text}
          </p>
          
          {cast.embeds && cast.embeds.length > 0 && cast.embeds[0].url && (
            <div className="mt-3 flex items-center gap-2 text-blue-600 text-sm">
              <ExternalLink size={14} />
              <a 
                href={cast.embeds[0].url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:underline truncate"
              >
                {cast.embeds[0].url}
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-6 mt-4 text-gray-500">
            <div className="flex items-center gap-2 hover:text-red-500 transition">
              <Heart size={18} />
              <span className="text-sm">{cast.reactions?.likes_count || 0}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-500 transition">
              <Repeat2 size={18} />
              <span className="text-sm">{cast.reactions?.recasts_count || 0}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-500 transition">
              <MessageCircle size={18} />
              <span className="text-sm">{cast.replies?.count || 0}</span>
            </div>
          </div>
          
          {isPaid && (
            <div className="mt-3 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              ✓ Tipped
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
