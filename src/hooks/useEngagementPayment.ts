import { useEffect, useRef } from 'react';
import { ENGAGEMENT_TIP_AMOUNT, ENGAGEMENT_TIP_INTERVAL_MS } from '../constants';
import { sendSinglePayment, getPaymentAddress } from '../utils/payments';
import { FarcasterCast } from '../types';

export function useEngagementPayment(
  provider: any,
  fromAddress: string,
  cast: FarcasterCast | null,
  enabled: boolean
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL;

  useEffect(() => {
    if (!enabled || !cast || !provider || !fromAddress) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const paymentAddress = getPaymentAddress(cast.author);

    // Send immediate payment on engagement start
    sendSinglePayment(
      provider,
      fromAddress,
      paymentAddress,
      ENGAGEMENT_TIP_AMOUNT,
      paymasterUrl
    ).catch(console.error);

    // Set up recurring payments
    intervalRef.current = setInterval(() => {
      sendSinglePayment(
        provider,
        fromAddress,
        paymentAddress,
        ENGAGEMENT_TIP_AMOUNT,
        paymasterUrl
      ).catch(console.error);
    }, ENGAGEMENT_TIP_INTERVAL_MS);

    // Cleanup on unmount or when cast changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [provider, fromAddress, cast, enabled, paymasterUrl]);
}
