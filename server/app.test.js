import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import { createServer } from 'node:http';
import test from 'node:test';
import { createApp } from './app.js';
import { calculatePaymentAmount, dokuBankVaMethods, loadPaymentConfig } from './payments/config.js';

function createMemoryPool() {
  const rows = new Map();
  const paymentRows = new Map();

  return {
    rows,
    paymentRows,
    async query() {
      return [[{ health: 1 }]];
    },
    async execute(sql, params) {
      if (sql.includes('SELECT id, unit_price_idr')) {
        const row = rows.get(params[0]);
        return [[row ? {
          id: row.id,
          unit_price_idr: row.unit_price_idr,
          travelers: row.travelers,
          registrant_name: row.registrant_name,
          phone: row.phone
        } : undefined].filter(Boolean)];
      }

      if (sql.includes('SELECT invoice_number, amount_idr, payment_url')) {
        const [draftId, paymentType] = params;
        const matching = [...paymentRows.values()]
          .filter(row => row.registration_draft_id === draftId && row.payment_type === paymentType &&
            row.status === 'pending' && row.payment_url)
          .sort((left, right) => right.created_at - left.created_at);
        return [[matching[0] ? { ...matching[0] } : undefined].filter(Boolean)];
      }

      if (sql.includes('SELECT id, amount_idr, status') && sql.includes('invoice_number')) {
        const row = [...paymentRows.values()].find(item => item.invoice_number === params[0]);
        return [[row ? { id: row.id, amount_idr: row.amount_idr, status: row.status } : undefined].filter(Boolean)];
      }

      if (sql.includes('INSERT INTO registration_payments')) {
        const [id, draftId, invoiceNumber, paymentType, amount] = params;
        paymentRows.set(id, {
          id,
          registration_draft_id: draftId,
          invoice_number: invoiceNumber,
          payment_type: paymentType,
          amount_idr: amount,
          status: 'pending',
          created_at: Date.now(),
          payment_url: null
        });
        return [{ affectedRows: 1 }];
      }

      if (sql.includes('UPDATE registration_payments')) {
        const row = paymentRows.get(params.at(-1)) ?? [...paymentRows.values()].find(item =>
          item.id === params[0] || item.id === params[1]
        );
        if (sql.includes('SET status = \'failed\'')) {
          const payment = paymentRows.get(params[0]);
          if (payment?.status === 'pending') payment.status = 'failed';
          return [{ affectedRows: payment ? 1 : 0 }];
        }
        if (sql.includes('SET doku_request_id')) {
          const payment = paymentRows.get(params[2]);
          if (payment) {
            payment.doku_request_id = params[0];
            payment.payment_url = params[1];
          }
          return [{ affectedRows: payment ? 1 : 0 }];
        }
        if (sql.includes("SET status = 'paid'")) {
          const payment = paymentRows.get(params[0]);
          if (payment?.status === 'pending') payment.status = 'paid';
          return [{ affectedRows: payment ? 1 : 0 }];
        }
        return [{ affectedRows: row ? 1 : 0 }];
      }

      if (sql.includes('SELECT id, package_id')) {
        const row = rows.get(params[0]);
        return [[row ? { ...row } : undefined].filter(Boolean)];
      }

      if (sql.includes('SELECT id') && sql.includes('access_token_hash')) {
        const row = rows.get(params[0]);
        return [[row ? { id: row.id } : undefined].filter(Boolean)];
      }

      if (sql.includes('UPDATE registration_drafts')) {
        const [packageId, packageName, departure, duration, unitPriceIdr, travelers, name, phone, note, id, tokenHash] = params;
        const row = rows.get(tokenHash);
        if (!row || row.id !== id) return [{ affectedRows: 0 }];
        Object.assign(row, {
          package_id: packageId,
          package_name: packageName,
          departure,
          duration,
          unit_price_idr: unitPriceIdr,
          travelers,
          registrant_name: name,
          phone,
          note
        });
        return [{ affectedRows: 1 }];
      }

      if (sql.includes('INSERT INTO registration_drafts')) {
        const [id, tokenHash, packageId, packageName, departure, duration, unitPriceIdr, travelers, name, phone, note] = params;
        rows.set(tokenHash, {
          id,
          access_token_hash: tokenHash,
          package_id: packageId,
          package_name: packageName,
          departure,
          duration,
          unit_price_idr: unitPriceIdr,
          travelers,
          registrant_name: name,
          phone,
          note
        });
        return [{ affectedRows: 1 }];
      }

      throw new Error(`Unexpected SQL in test: ${sql}`);
    }
  };
}

async function withApiServer(callback, dependencies = {}) {
  const pool = createMemoryPool();
  const server = createServer(createApp({ pool, secureCookies: false, ...dependencies }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    await callback(`http://127.0.0.1:${port}`, pool);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

test('creates a draft and restores it using the HttpOnly cookie', async () => {
  await withApiServer(async (baseUrl, pool) => {
    const createResponse = await fetch(`${baseUrl}/api/registrations/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: '1', travelers: '2' })
    });

    assert.equal(createResponse.status, 201);
    const cookieHeader = createResponse.headers.get('set-cookie');
    assert.match(cookieHeader, /HttpOnly/i);
    assert.match(cookieHeader, /SameSite=Lax/i);
    assert.match(cookieHeader, /Max-Age=86400/i);
    assert.equal(pool.rows.size, 1);

    const token = cookieHeader.split(';', 1)[0];
    const savedHash = createHash('sha256').update(decodeURIComponent(token.split('=')[1])).digest('hex');
    assert.equal(pool.rows.has(savedHash), true);

    const restoreResponse = await fetch(`${baseUrl}/api/registrations/draft`, {
      headers: { Cookie: token }
    });
    assert.equal(restoreResponse.status, 200);
    assert.deepEqual(await restoreResponse.json(), {
      registration: {
        id: pool.rows.get(savedHash).id,
        packageId: '1',
        travelers: '2',
        name: '',
        phone: '',
        note: ''
      }
    });
  });
});

test('updates a saved draft with contact details without creating a second row', async () => {
  await withApiServer(async (baseUrl, pool) => {
    const firstResponse = await fetch(`${baseUrl}/api/registrations/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: '1', travelers: '1' })
    });
    const token = firstResponse.headers.get('set-cookie').split(';', 1)[0];

    const updateResponse = await fetch(`${baseUrl}/api/registrations/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: token },
      body: JSON.stringify({
        packageId: '2',
        travelers: '2',
        name: 'Jamaah Contoh',
        phone: '+62 812-3456-7890',
        note: 'Catatan'
      })
    });

    assert.equal(updateResponse.status, 200);
    assert.equal(pool.rows.size, 1);
    const saved = [...pool.rows.values()][0];
    assert.equal(saved.package_id, 2);
    assert.equal(saved.registrant_name, 'Jamaah Contoh');
    assert.equal(saved.phone, '+6281234567890');
    assert.equal(saved.unit_price_idr, 29500000);
  });
});

test('rejects invalid package IDs and incomplete contact pairs', async () => {
  await withApiServer(async (baseUrl, pool) => {
    const invalidPackage = await fetch(`${baseUrl}/api/registrations/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: '999', travelers: '1' })
    });
    assert.equal(invalidPackage.status, 400);

    const incompleteContact = await fetch(`${baseUrl}/api/registrations/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: '1', travelers: '1', name: 'Jamaah' })
    });
    assert.equal(incompleteContact.status, 400);
    assert.equal(pool.rows.size, 0);
  });
});

test('allows full payment while DP remains unconfigured, and reuses a pending checkout', async () => {
  const paymentConfig = {
    enabled: true,
    missingGateway: [],
    dpEnabled: false,
    missingDp: ['PAYMENT_DP_POLICY', 'PAYMENT_DP_VALUE'],
    clientId: 'test-client',
    secretKey: 'test-secret',
    callbackUrl: 'https://travel.example.test/daftar?payment=return'
  };
  let checkoutCount = 0;
  const dokuClient = {
    async createCheckout(input) {
      checkoutCount += 1;
      assert.deepEqual(input.paymentMethodTypes, dokuBankVaMethods);
      return {
        requestId: 'doku-request-1',
        paymentUrl: 'https://sandbox.doku.com/checkout-link-v2/session-id'
      };
    }
  };

  await withApiServer(async (baseUrl, pool) => {
    const draftResponse = await fetch(`${baseUrl}/api/registrations/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageId: '1',
        travelers: '2',
        name: 'Jamaah Contoh',
        phone: '+6281234567890'
      })
    });
    const token = draftResponse.headers.get('set-cookie').split(';', 1)[0];
    const savedDraft = [...pool.rows.values()][0];
    const expectedAmount = savedDraft.unit_price_idr * savedDraft.travelers;

    const paymentRequest = () => fetch(`${baseUrl}/api/registrations/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: token },
      body: JSON.stringify({ paymentType: 'full' })
    });
    const firstResponse = await paymentRequest();
    assert.equal(firstResponse.status, 201);
    const firstResult = await firstResponse.json();
    assert.equal(firstResult.payment.amount, expectedAmount);

    const secondResponse = await paymentRequest();
    assert.equal(secondResponse.status, 200);
    assert.deepEqual(await secondResponse.json(), firstResult);
    assert.equal(checkoutCount, 1);
    assert.equal(pool.paymentRows.size, 1);

    const dpResponse = await fetch(`${baseUrl}/api/registrations/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: token },
      body: JSON.stringify({ paymentType: 'dp' })
    });
    assert.equal(dpResponse.status, 503);
  }, { paymentConfig, dokuClient });
});

test('verifies DOKU notification signatures and applies successful payment idempotently', async () => {
  const clientId = 'test-client';
  const secretKey = 'test-secret';
  const paymentConfig = {
    enabled: true,
    dpEnabled: true,
    missingDp: [],
    clientId,
    secretKey,
    callbackUrl: 'https://travel.example.test/daftar?payment=return'
  };
  const dokuClient = { async createCheckout() {
    return {
      requestId: 'doku-request-1',
      paymentUrl: 'https://sandbox.doku.com/checkout-link-v2/session-id'
    };
  } };

  await withApiServer(async (baseUrl, pool) => {
    const draftResponse = await fetch(`${baseUrl}/api/registrations/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageId: '1',
        travelers: '1',
        name: 'Jamaah Contoh',
        phone: '+6281234567890'
      })
    });
    const cookieToken = draftResponse.headers.get('set-cookie').split(';', 1)[0];
    const paymentResponse = await fetch(`${baseUrl}/api/registrations/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieToken },
      body: JSON.stringify({ paymentType: 'full' })
    });
    const { payment } = await paymentResponse.json();
    const storedPayment = [...pool.paymentRows.values()][0];
    const body = JSON.stringify({
      transaction: { status: 'SUCCESS' },
      order: { invoice_number: payment.invoiceNumber, amount: payment.amount }
    });
    const timestamp = '2026-11-26T02:00:00.000Z';
    const requestId = 'doku-notification-1';
    const digest = createHash('sha256').update(body).digest('base64');
    const component = [
      `Client-Id:${clientId}`,
      `Request-Id:${requestId}`,
      `Request-Timestamp:${timestamp}`,
      'Request-Target:/api/webhooks/doku',
      `Digest:${digest}`
    ].join('\n');
    const signature = `HMACSHA256=${createHmac('sha256', secretKey).update(component).digest('base64')}`;
    const headers = {
      'Content-Type': 'application/json',
      'Client-Id': clientId,
      'Request-Id': requestId,
      'Request-Timestamp': timestamp,
      Signature: signature
    };

    const paidResponse = await fetch(`${baseUrl}/api/webhooks/doku`, {
      method: 'POST',
      headers,
      body
    });
    assert.equal(paidResponse.status, 200);
    assert.equal(storedPayment.status, 'paid');

    const duplicateResponse = await fetch(`${baseUrl}/api/webhooks/doku`, {
      method: 'POST',
      headers,
      body
    });
    assert.equal(duplicateResponse.status, 200);
    assert.equal(storedPayment.status, 'paid');

    const badSignatureResponse = await fetch(`${baseUrl}/api/webhooks/doku`, {
      method: 'POST',
      headers: { ...headers, Signature: 'HMACSHA256=invalid' },
      body
    });
    assert.equal(badSignatureResponse.status, 403);
  }, { paymentConfig, dokuClient });
});

test('loads DP rules as optional configuration and calculates only configured amounts', () => {
  const config = loadPaymentConfig({
    DOKU_CLIENT_ID: 'test-client',
    DOKU_SECRET_KEY: 'test-secret',
    DOKU_MODE: 'sandbox',
    PUBLIC_APP_URL: 'https://travel.example.test'
  });
  assert.equal(config.enabled, true);
  assert.equal(config.dpEnabled, false);
  assert.deepEqual(config.paymentMethodTypes, dokuBankVaMethods);
  assert.equal(calculatePaymentAmount({
    paymentType: 'full',
    totalAmount: 1000000,
    travelers: 2
  }), 1000000);
  assert.throws(() => calculatePaymentAmount({
    paymentType: 'dp',
    totalAmount: 1000000,
    travelers: 2
  }), /DP payment has not been configured/);
  assert.equal(calculatePaymentAmount({
    paymentType: 'dp',
    totalAmount: 1000000,
    travelers: 2,
    dpPolicy: 'fixed_per_traveler',
    dpValue: 100000
  }), 200000);
});

test('allows only explicitly supported DOKU bank Virtual Account methods in environment overrides', () => {
  const config = loadPaymentConfig({
    DOKU_CLIENT_ID: 'test-client',
    DOKU_SECRET_KEY: 'test-secret',
    PUBLIC_APP_URL: 'https://travel.example.test',
    DOKU_PAYMENT_METHOD_TYPES: 'VIRTUAL_ACCOUNT_BCA, VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI'
  });
  assert.deepEqual(config.paymentMethodTypes, [
    'VIRTUAL_ACCOUNT_BCA',
    'VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI'
  ]);
  assert.throws(() => loadPaymentConfig({
    DOKU_CLIENT_ID: 'test-client',
    DOKU_SECRET_KEY: 'test-secret',
    PUBLIC_APP_URL: 'https://travel.example.test',
    DOKU_PAYMENT_METHOD_TYPES: 'VIRTUAL_ACCOUNT_BCA,QRIS'
  }), /only supported bank Virtual Account methods/);
});

test('keeps DOKU disabled without a valid public HTTPS origin while allowing local API use', () => {
  const config = loadPaymentConfig({
    DOKU_CLIENT_ID: 'test-client',
    DOKU_SECRET_KEY: 'test-secret',
    PUBLIC_APP_URL: 'http://localhost:5173'
  });

  assert.equal(config.enabled, false);
  assert.equal(config.callbackUrl, null);
  assert.ok(config.missingGateway.includes('PUBLIC_APP_URL'));
});
