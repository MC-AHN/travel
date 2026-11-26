import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import test from 'node:test';
import { createDokuCheckoutClient } from './doku.js';
import { dokuBankVaMethods } from './config.js';

const checkoutInput = {
  amount: 300000,
  invoiceNumber: 'SAFAR-20261126-0001',
  callbackUrl: 'https://travel.example.test/pendaftaran/status'
};

test('creates a signed sandbox checkout request and returns its trusted payment URL', async () => {
  let request;
  const client = createDokuCheckoutClient({
    clientId: 'test-client',
    secretKey: 'test-secret',
    now: () => new Date('2026-11-26T02:00:00.000Z'),
    createRequestId: () => 'request-123',
    fetchImpl: async (url, options) => {
      request = { url, ...options };
      return new Response(JSON.stringify({
        response: { payment: { url: 'https://sandbox.doku.com/checkout-link-v2/session-id' } }
      }), { status: 200 });
    }
  });

  const result = await client.createCheckout(checkoutInput);
  const digest = createHash('sha256').update(request.body).digest('base64');
  const signatureComponent = [
    'Client-Id:test-client',
    'Request-Id:request-123',
    'Request-Timestamp:2026-11-26T02:00:00.000Z',
    'Request-Target:/checkout/v1/payment',
    `Digest:${digest}`
  ].join('\n');
  const expectedSignature = `HMACSHA256=${createHmac('sha256', 'test-secret')
    .update(signatureComponent)
    .digest('base64')}`;

  assert.equal(request.url, 'https://api-sandbox.doku.com/checkout/v1/payment');
  assert.equal(request.method, 'POST');
  assert.equal(request.headers.Signature, expectedSignature);
  assert.equal(JSON.parse(request.body).order.amount, checkoutInput.amount);
  assert.deepEqual(JSON.parse(request.body).payment.payment_method_types, dokuBankVaMethods);
  assert.deepEqual(result, {
    paymentUrl: 'https://sandbox.doku.com/checkout-link-v2/session-id',
    requestId: 'request-123'
  });
});

test('requires complete credentials and valid checkout values', async () => {
  assert.throws(
    () => createDokuCheckoutClient({ clientId: '', secretKey: '' }),
    /Client ID and Secret Key are required/
  );

  const client = createDokuCheckoutClient({
    clientId: 'test-client',
    secretKey: 'test-secret',
    fetchImpl: async () => new Response('{}', { status: 200 })
  });

  await assert.rejects(
    client.createCheckout({ ...checkoutInput, amount: 0 }),
    /positive IDR integer/
  );
  await assert.rejects(
    client.createCheckout({ ...checkoutInput, callbackUrl: 'http://localhost:3001/callback' }),
    /public HTTPS callback URL/
  );
});

test('rejects a payment URL outside DOKU HTTPS domains', async () => {
  const client = createDokuCheckoutClient({
    clientId: 'test-client',
    secretKey: 'test-secret',
    fetchImpl: async () => new Response(JSON.stringify({
      response: { payment: { url: 'https://attacker.example/checkout' } }
    }), { status: 200 })
  });

  await assert.rejects(client.createCheckout(checkoutInput), /outside its trusted HTTPS domain/);
});

test('rejects checkout methods outside the bank Virtual Account allowlist', async () => {
  const client = createDokuCheckoutClient({
    clientId: 'test-client',
    secretKey: 'test-secret',
    fetchImpl: async () => {
      throw new Error('DOKU must not be called for a non-bank payment method.');
    }
  });

  await assert.rejects(
    client.createCheckout({ ...checkoutInput, paymentMethodTypes: ['QRIS'] }),
    /restricted to supported bank Virtual Account methods/
  );
});
