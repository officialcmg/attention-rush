import { useState, useEffect } from 'react';
import { createBaseAccountSDK } from '@base-org/account';
import { CHAIN_ID } from '../constants';

export function useBaseAccount() {
  const [provider, setProvider] = useState<any>(null);
  const [universalAddress, setUniversalAddress] = useState<string>(''); // Main account
  const [subAccountAddress, setSubAccountAddress] = useState<string>(''); // Sub account for transactions
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize SDK
  useEffect(() => {
    const sdk = createBaseAccountSDK({
      appName: 'AttentionRush',
      appLogoUrl: 'https://base.org/logo.png',
      appChainIds: [CHAIN_ID],
      subAccounts: {
        creation: 'on-connect',
        defaultAccount: 'sub',
      }
    });

    const providerInstance = sdk.getProvider();
    setProvider(providerInstance);

    // Check if already connected
    checkConnection(providerInstance);
  }, []);

  const checkConnection = async (providerInstance: any) => {
    try {
      const accounts = await providerInstance.request({
        method: 'eth_accounts', // Non-interactive check
        params: []
      });

      if (accounts && accounts.length > 0) {
        const universalAddr = accounts[0];
        setUniversalAddress(universalAddr);

        // Get sub account
        const response = await providerInstance.request({
          method: 'wallet_getSubAccounts',
          params: [{
            account: universalAddr,
            domain: window.location.origin,
          }]
        });

        const existing = response.subAccounts[0];
        if (existing) {
          setSubAccountAddress(existing.address);
          setConnected(true);
        }
      }
    } catch (error) {
      console.log('Not connected yet');
    }
  };

  const connect = async () => {
    if (!provider) return;

    setLoading(true);
    try {
      // Request accounts
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
        params: []
      });

      const universalAddr = accounts[0];
      setUniversalAddress(universalAddr); // This is the MAIN account to display

      // Check for existing sub account
      const response = await provider.request({
        method: 'wallet_getSubAccounts',
        params: [{
          account: universalAddr,
          domain: window.location.origin,
        }]
      });

      const existing = response.subAccounts[0];
      
      if (existing) {
        setSubAccountAddress(existing.address);
        console.log('✅ Existing sub-account found:', existing.address);
      } else {
        // Create new sub account
        console.log('Creating new sub-account...');
        const newSubAccount = await provider.request({
          method: 'wallet_addSubAccount',
          params: [{
            account: {
              type: 'create',
            }
          }]
        });
        setSubAccountAddress(newSubAccount.address);
        console.log('✅ Sub-account created:', newSubAccount.address);
      }

      setConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setUniversalAddress('');
    setSubAccountAddress('');
  };

  return {
    provider,
    universalAddress, // Main account for display
    subAccountAddress, // Sub account for transactions
    connected,
    loading,
    connect,
    disconnect
  };
}
