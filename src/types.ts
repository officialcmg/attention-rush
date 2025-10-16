export type FarcasterUser = {
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url?: string;
  verifications: string[];
}

export type FarcasterCast = {
  hash: string;
  text: string;
  author: FarcasterUser;
  timestamp: string;
  embeds?: Array<{
    url?: string;
  }>;
  reactions?: {
    likes_count: number;
    recasts_count: number;
  };
  replies?: {
    count: number;
  };
}

export type PaymentQueueItem = {
  castHash: string;
  recipientAddress: string;
  amount: string;
}
