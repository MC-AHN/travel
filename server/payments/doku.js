import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { dokuBankVaMethods } from './config.js';

const checkoutPath = '/checkout/v1/payment';
const dokuHosts = {
  sandbox: 'https://api-sandbox.doku.com',
  production: 'https://api.doku.com'
};
const allowedBankVaMethods = new Set(dokuBankVaMethods);

function createDigest(body) {
  return createHash('sha256').update(body).digest('base64');
}

function createSignature({ clientId, requestId, timestamp, target, digest, secretKey }) {
  const component = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${target}`,
    `Digest:${digest}`
  ].join('\n');

  return `HMACSHA256=${createHmac('sha256', secretKey).update(component).digest('base64')}`;
}

export function verifyDokuNotification({ headers, rawBody, secretKey, expectedClientId, requestTarget }) {
  const clientId = headers['client-id'];
  const requestId = headers['request-id'];
  const timestamp = headers['request-timestamp'];
  const providedSignature = headers.signature;

  if (
    typeof rawBody !== 'string' && !Buffer.isBuffer(rawBody) ||
    !clientId || !requestId || !timestamp || !providedSignature ||
    clientId !== expectedClientId
  ) {
    return false;
  }

  const expectedSignature = createSignature({
    clientId,
    requestId,
    timestamp,
    target: requestTarget,
    digest: createDigest(rawBody),
    secretKey
  });
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

function assertCheckoutInput({ amount, invoiceNumber, callbackUrl }) {
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > 999_999_999_999) {
    throw new Error('DOKU checkout amount must be a positive IDR integer with at most 12 digits.');
  }
  if (typeof invoiceNumber !== 'string' || invoiceNumber.length < 1 || invoiceNumber.length > 30) {
    throw new Error('DOKU invoice number must contain between 1 and 30 characters.');
  }

  let url;
  try {
    url = new URL(callbackUrl);
  } catch {
    throw new Error('A valid public HTTPS callback URL is required for DOKU checkout.');
  }
  if (url.protocol !== 'https:') {
    throw new Error('A public HTTPS callback URL is required for DOKU checkout.');
  }
}

export function createDokuCheckoutClient({
  clientId,
  secretKey,
  mode = 'sandbox',
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  createRequestId = randomUUID
}) {
  if (!clientId || !secretKey) {
    throw new Error('DOKU Client ID and Secret Key are required before payments can be enabled.');
  }
  if (!Object.hasOwn(dokuHosts, mode)) {
    throw new Error('DOKU mode must be either "sandbox" or "production".');
  }
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required for DOKU checkout.');
  }

  return {
    async createCheckout({
      amount,
      invoiceNumber,
      callbackUrl,
      customer,
      paymentMethodTypes = dokuBankVaMethods,
      paymentDueMinutes = 60
    }) {
      assertCheckoutInput({ amount, invoiceNumber, callbackUrl });
      if (!Number.isSafeInteger(paymentDueMinutes) || paymentDueMinutes < 1 || paymentDueMinutes > 999_999) {
        throw new Error('DOKU payment due time must be between 1 and 999999 minutes.');
      }
      if (
        !Array.isArray(paymentMethodTypes) ||
        paymentMethodTypes.length === 0 ||
        paymentMethodTypes.some(method => !allowedBankVaMethods.has(method))
      ) {
        throw new Error('DOKU Checkout is restricted to supported bank Virtual Account methods.');
      }

      const requestId = createRequestId();
      const timestamp = now().toISOString();
      const requestBody = {
        order: {
          amount,
          invoice_number: invoiceNumber,
          callback_url: callbackUrl,
          callback_url_result: callbackUrl,
          auto_redirect: true,
          language: 'ID'
        },
        payment: {
          payment_due_date: paymentDueMinutes,
          payment_method_types: paymentMethodTypes
        }
      };
      if (customer?.name && customer?.phone) {
        requestBody.customer = {
          name: customer.name,
          phone: customer.phone.replace(/^\+/, ''),
          country: 'ID'
        };
      }
      const body = JSON.stringify(requestBody);
      const digest = createDigest(body);
      const signature = createSignature({
        clientId,
        requestId,
        timestamp,
        target: checkoutPath,
        digest,
        secretKey
      });

      const response = await fetchImpl(`${dokuHosts[mode]}${checkoutPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': clientId,
          'Request-Id': requestId,
          'Request-Timestamp': timestamp,
          Signature: signature
        },
        body
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`DOKU checkout request failed with HTTP ${response.status}.`);
      }

      const paymentUrl = result?.response?.payment?.url;
      if (typeof paymentUrl !== 'string') {
        throw new Error('DOKU checkout response did not contain a payment URL.');
      }

      let parsedPaymentUrl;
      try {
        parsedPaymentUrl = new URL(paymentUrl);
      } catch {
        throw new Error('DOKU returned an invalid payment URL.');
      }
      if (parsedPaymentUrl.protocol !== 'https:' || !parsedPaymentUrl.hostname.endsWith('.doku.com')) {
        throw new Error('DOKU returned a payment URL outside its trusted HTTPS domain.');
      }

      return { paymentUrl, requestId };
    }
  };
}
