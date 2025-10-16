import { useState } from 'react';
import { FarcasterCast } from '../types';
import { CastCard } from './CastCard';
import { CastModal } from './CastModal';
import { Loader2 } from 'lucide-react';

interface FeedProps {
  casts: FarcasterCast[];
  loading: boolean;
  error: string | null;
  onCastFullyVisible: (cast: FarcasterCast) => void;
  onCastClick: (cast: FarcasterCast) => void;
  paidCasts: Set<string>;
}

export function Feed({
  casts,
  loading,
  error,
  onCastFullyVisible,
  onCastClick,
  paidCasts
}: FeedProps) {
  const [selectedCast, setSelectedCast] = useState<FarcasterCast | null>(null);

  const handleCastClick = (cast: FarcasterCast) => {
    setSelectedCast(cast);
    onCastClick(cast);
  };

  const handleCloseModal = () => {
    setSelectedCast(null);
    onCastClick(null as any); // Signal to stop engagement payments
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Feed</h2>
        <p className="text-gray-600">{error}</p>
        <p className="text-sm text-gray-500 mt-4">
          Make sure you've set VITE_NEYNAR_API_KEY in your .env.local file
        </p>
      </div>
    );
  }

  if (casts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-600">No casts found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {casts.map((cast) => (
          <CastCard
            key={cast.hash}
            cast={cast}
            onFullyVisible={onCastFullyVisible}
            onClick={handleCastClick}
            isPaid={paidCasts.has(cast.hash)}
          />
        ))}
      </div>

      {selectedCast && (
        <CastModal cast={selectedCast} onClose={handleCloseModal} />
      )}
    </>
  );
}
