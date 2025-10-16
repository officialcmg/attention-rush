import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  VIEWPORT_TIP_AMOUNT, 
  BATCH_SIZE, 
  BATCH_TIMEOUT_MS 
} from '../constants';
import { sendBatchPayments, getPaymentAddress } from '../utils/payments';
import { FarcasterCast } from '../types';

export function useViewportPayments(
  provider: any,
  fromAddress: string,
  enabled: boolean
) {
  const [paidCasts, setPaidCasts] = useState<Set<string>>(new Set());
  const [pendingPayments, setPendingPayments] = useState<Array<{
    castHash: string;
    address: string;
  }>>([]);
  
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL;

  // Process batch payments
  const processBatch = useCallback(async (payments: Array<{ castHash: string; address: string }>) => {
    if (payments.length === 0 || !provider || !fromAddress) return;

    const recipients = payments.map(p => ({
      address: p.address,
      amount: VIEWPORT_TIP_AMOUNT
    }));

    try {
      await sendBatchPayments(provider, fromAddress, recipients, paymasterUrl);
      
      // Mark all as paid
      setPaidCasts(prev => {
        const newSet = new Set(prev);
        payments.forEach(p => newSet.add(p.castHash));
        return newSet;
      });
      
      // Clear pending
      setPendingPayments([]);
    } catch (error) {
      console.error('Batch payment failed:', error);
    }
  }, [provider, fromAddress, paymasterUrl]);

  // Add payment to queue
  const queuePayment = useCallback((cast: FarcasterCast) => {
    if (!enabled || paidCasts.has(cast.hash)) return;

    const paymentAddress = getPaymentAddress(cast.author);
    
    setPendingPayments(prev => {
      const newPending = [...prev, { 
        castHash: cast.hash, 
        address: paymentAddress 
      }];

      // If we hit batch size, process immediately
      if (newPending.length >= BATCH_SIZE) {
        processBatch(newPending);
        return [];
      }

      // Set timeout to process batch after delay
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      
      batchTimeoutRef.current = setTimeout(() => {
        processBatch(newPending);
      }, BATCH_TIMEOUT_MS);

      return newPending;
    });
  }, [enabled, paidCasts, processBatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  return {
    queuePayment,
    paidCasts,
    pendingCount: pendingPayments.length
  };
}
