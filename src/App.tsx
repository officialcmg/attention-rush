import { useState } from 'react';
import { Header } from './components/Header';
import { Feed } from './components/Feed';
import { useBaseAccount } from './hooks/useBaseAccount';
import { useFarcaster } from './hooks/useFarcaster';
import { useViewportPayments } from './hooks/useViewportPayments';
import { useEngagementPayment } from './hooks/useEngagementPayment';
import { FarcasterCast } from './types';

function App() {
  const [selectedCast, setSelectedCast] = useState<FarcasterCast | null>(null);
  
  // Base Account connection
  const {
    provider,
    subAccountAddress, // Sub account for payments
    connected,
    loading: accountLoading,
    connect,
    disconnect
  } = useBaseAccount();

  // Farcaster feed
  const { casts, loading: feedLoading, error } = useFarcaster();

  // Viewport payments (batch)
  const { queuePayment, paidCasts, pendingCount } = useViewportPayments(
    provider,
    subAccountAddress,
    connected
  );

  // Engagement payments (every 4 seconds)
  useEngagementPayment(
    provider,
    subAccountAddress,
    selectedCast,
    connected
  );

  const handleCastClick = (cast: FarcasterCast | null) => {
    setSelectedCast(cast);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        connected={connected}
        subAccountAddress={subAccountAddress}
        loading={accountLoading}
        onConnect={connect}
        onDisconnect={disconnect}
        pendingPayments={pendingCount}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {!connected ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to AttentionRush
            </h2>
            <p className="text-gray-600 mb-6">
              Pay Farcaster creators with your attention - no wallet pop-ups!
            </p>
            <button
              onClick={connect}
              disabled={accountLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {accountLoading ? 'Connecting...' : 'Connect to Start'}
            </button>
            
            <div className="mt-12 bg-white rounded-xl shadow-md p-6 text-left max-w-md mx-auto">
              <h3 className="font-bold text-lg mb-3">How it works:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">👁️</span>
                  <span>Posts 100% in view get tipped automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">💰</span>
                  <span>Batched payments = no spam transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">🎯</span>
                  <span>Click posts for extra engagement tips (every 4s)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">⚡</span>
                  <span>Powered by Base Account Sub Accounts - zero friction!</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Feed
            casts={casts}
            loading={feedLoading}
            error={error}
            onCastFullyVisible={queuePayment}
            onCastClick={handleCastClick}
            paidCasts={paidCasts}
          />
        )}
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Built with Base Account SDK · Powered by Farcaster & Neynar</p>
        <p className="mt-1">Base Sepolia Testnet</p>
      </footer>
    </div>
  );
}

export default App;
