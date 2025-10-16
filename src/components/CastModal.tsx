import { X, ExternalLink } from 'lucide-react';
import { FarcasterCast } from '../types';

interface CastModalProps {
  cast: FarcasterCast;
  onClose: () => void;
}

export function CastModal({ cast, onClose }: CastModalProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Cast Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Author */}
          <div className="flex items-start gap-4 mb-6">
            <img
              src={cast.author.pfp_url || 'https://via.placeholder.com/64'}
              alt={cast.author.display_name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <div className="font-bold text-xl text-gray-900">
                {cast.author.display_name}
              </div>
              <div className="text-gray-500">@{cast.author.username}</div>
              <div className="text-sm text-gray-400 mt-1">
                {formatTimestamp(cast.timestamp)}
              </div>
            </div>
          </div>

          {/* Cast Text */}
          <p className="text-lg text-gray-800 whitespace-pre-wrap mb-6">
            {cast.text}
          </p>

          {/* Embeds */}
          {cast.embeds && cast.embeds.length > 0 && (
            <div className="mb-6">
              {cast.embeds.map((embed, idx) => (
                embed.url && (
                  <a
                    key={idx}
                    href={embed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <ExternalLink size={16} />
                    <span className="truncate">{embed.url}</span>
                  </a>
                )
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {cast.reactions?.likes_count || 0}
                </div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {cast.reactions?.recasts_count || 0}
                </div>
                <div className="text-sm text-gray-600">Recasts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {cast.replies?.count || 0}
                </div>
                <div className="text-sm text-gray-600">Replies</div>
              </div>
            </div>
          </div>

          {/* Engagement Notice */}
          <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div>
                <div className="font-semibold text-green-800">
                  Engagement Payment Active
                </div>
                <div className="text-sm text-green-600">
                  Tipping {cast.author.display_name} every 4 seconds while viewing
                </div>
              </div>
            </div>
          </div>

          {/* Comments Placeholder */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">Comments</h3>
            <div className="text-gray-500 text-center py-8">
              <MessageCircle size={48} className="mx-auto mb-2 opacity-30" />
              <p>Comments view coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageCircle({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
