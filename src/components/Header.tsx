import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';

interface HeaderProps {
  connected: boolean;
  subAccountAddress: string;
  loading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  pendingPayments: number;
}

export function Header({
  connected,
  subAccountAddress,
  loading,
  onConnect,
  onDisconnect,
  pendingPayments
}: HeaderProps) {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(subAccountAddress);
  };

  const handleOpenBasescan = () => {
    window.open(`https://sepolia.basescan.org/address/${subAccountAddress}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">AttentionRush</h1>
              <p className="text-xs text-blue-100">Pay creators with your attention</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {pendingPayments > 0 && (
              <div className="bg-blue-700 px-3 py-1 rounded-full text-sm">
                {pendingPayments} pending tip{pendingPayments > 1 ? 's' : ''}
              </div>
            )}
            
            {connected ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-blue-100">Account</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-mono">
                      {subAccountAddress.slice(0, 6)}...{subAccountAddress.slice(-4)}
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 hover:bg-blue-700 rounded transition"
                      title="Copy address"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={handleOpenBasescan}
                      className="p-1 hover:bg-blue-700 rounded transition"
                      title="View on Basescan"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                disabled={loading}
                className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
              >
                <Wallet size={18} />
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
