import { useState, useEffect } from 'react';
import { FarcasterCast } from '../types';

export function useFarcaster() {
  const [casts, setCasts] = useState<FarcasterCast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    const apiKey = import.meta.env.VITE_NEYNAR_API_KEY;
    
    if (!apiKey) {
      setError('Missing VITE_NEYNAR_API_KEY');
      setLoading(false);
      return;
    }

    try {
      // Only FREE endpoint on Neynar: /feed/user/casts
      // Using fid 3 (Dan Romero - Farcaster founder) for good content
      const response = await fetch(
        'https://api.neynar.com/v2/farcaster/feed/user/casts?fid=3&limit=50',
        {
          headers: {
            'accept': 'application/json',
            'api_key': apiKey,
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || errorData.error || `HTTP ${response.status}`;
        console.error('Neynar API Error:', response.status, errorData);
        throw new Error(`Neynar API: ${errorMsg} (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log('Fetched casts:', data.casts?.length);
      setCasts(data.casts || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch Farcaster feed:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feed');
      setLoading(false);
    }
  };

  return { casts, loading, error, refetch: fetchFeed };
}
