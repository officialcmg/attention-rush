import { encodeFunctionData, parseUnits, numberToHex } from 'viem';
import { USDC_ADDRESS, ERC20_ABI, CHAIN_ID } from '../constants';

/**
 * Creates a single USDC payment call
 */
export function createPaymentCall(recipientAddress: string, amountUSDC: string) {
  return {
    to: USDC_ADDRESS,
    value: '0x0',
    data: encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [
        recipientAddress as `0x${string}`,
        parseUnits(amountUSDC, 6) // USDC has 6 decimals
      ]
    })
  };
}

/**
 * Send a single USDC payment (for engagement tips)
 */
export async function sendSinglePayment(
  provider: any,
  fromAddress: string,
  recipientAddress: string,
  amountUSDC: string,
  paymasterUrl?: string
) {
  console.log('💸 SENDING PAYMENT:', {
    from: fromAddress,
    to: recipientAddress,
    amount: amountUSDC,
    timestamp: new Date().toISOString()
  });

  const calls = [createPaymentCall(recipientAddress, amountUSDC)];

  const params: any = {
    version: '1.0',
    chainId: numberToHex(CHAIN_ID),
    from: fromAddress,
    calls: calls,
  };

  // Add paymaster if URL is provided
  if (paymasterUrl) {
    params.capabilities = {
      paymasterService: {
        url: paymasterUrl
      }
    };
  }

  // Retry logic: 2 retries on failure (skip nonce/replacement errors)
  let lastError;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const result = await provider.request({
        method: 'wallet_sendCalls',
        params: [params]
      });

      console.log(`✅ Payment sent (attempt ${attempt + 1}):`, result);
      return result;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || '';
      
      // Don't retry nonce/replacement errors - just skip them
      if (errorMsg.includes('replacement underpriced') || errorMsg.includes('invalid account nonce')) {
        console.warn(`⚠️ Payment skipped (nonce conflict):`, errorMsg);
        return null; // Skip this payment
      }
      
      console.error(`❌ Payment failed (attempt ${attempt + 1}):`, error);
      
      if (attempt < 2) {
        // Wait 500ms before retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  throw lastError;
}

/**
 * Send batched USDC payments (for viewport tips)
 */
export async function sendBatchPayments(
  provider: any,
  fromAddress: string,
  recipients: Array<{ address: string; amount: string }>,
  paymasterUrl?: string
) {
  console.log('💰 BATCHING PAYMENTS:', {
    from: fromAddress,
    count: recipients.length,
    recipients: recipients,
    timestamp: new Date().toISOString()
  });

  const calls = recipients.map(({ address, amount }) =>
    createPaymentCall(address, amount)
  );

  const params: any = {
    version: '1.0',
    chainId: numberToHex(CHAIN_ID),
    from: fromAddress,
    calls: calls,
  };

  // Add paymaster if URL is provided
  if (paymasterUrl) {
    params.capabilities = {
      paymasterService: {
        url: paymasterUrl
      }
    };
  }

  // Retry logic: 2 retries on failure (skip nonce/replacement errors)
  let lastError;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const result = await provider.request({
        method: 'wallet_sendCalls',
        params: [params]
      });

      console.log(`✅ Batch payment sent (attempt ${attempt + 1}):`, result);
      return result;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || '';
      
      // Don't retry nonce/replacement errors - just skip them
      if (errorMsg.includes('replacement underpriced') || errorMsg.includes('invalid account nonce')) {
        console.warn(`⚠️ Batch payment skipped (nonce conflict):`, errorMsg);
        return null; // Skip this batch
      }
      
      console.error(`❌ Batch payment failed (attempt ${attempt + 1}):`, error);
      
      if (attempt < 2) {
        // Wait 500ms before retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  throw lastError;
}

/**
 * Get the payment address for a cast author
 * Prefers verified address, falls back to custody address
 */
export function getPaymentAddress(author: any): string {
  // Try verified address first (likely their main wallet)
  if (author.verifications && author.verifications.length > 0) {
    return author.verifications[0];
  }
  // Fallback to custody address
  return author.custody_address;
}
