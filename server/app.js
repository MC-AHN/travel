import { createHash, randomBytes, randomUUID } from 'node:crypto';
import cookie from 'cookie';
import express from 'express';
import { packages } from '../src/data.js';
import { calculatePaymentAmount, dokuBankVaMethods } from './payments/config.js';
import { verifyDokuNotification } from './payments/doku.js';

const draftCookieName = 'safar_registration_draft';
const draftLifetimeSeconds = 24 * 60 * 60;
const dokuNotificationPath = '/api/webhooks/doku';
const umrahPackages = packages.filter(item => item.category === 'Umrah');

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function setDraftCookie(response, token, maxAge = draftLifetimeSeconds, secure = false) {
  response.appendHeader('Set-Cookie', cookie.serialize(draftCookieName, token, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax',
    secure
  }));
}

function clearDraftCookie(response, secure = false) {
  response.appendHeader('Set-Cookie', cookie.serialize(draftCookieName, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure
  }));
}

function readDraftToken(request) {
  const token = cookie.parse(request.headers.cookie ?? '')[draftCookieName];
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}

function validateDraft(body) {
  const packageId = Number(body?.packageId);
  const packageItem = umrahPackages.find(item => item.id === packageId);
  if (!packageItem) return { error: 'Pilih paket umrah yang tersedia.' };

  const travelers = Number(body.travelers);
  if (!Number.isSafeInteger(travelers) || travelers < 1 || travelers > 2147483647) {
    return { error: 'Jumlah jamaah tidak valid.' };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const note = typeof body.note === 'string' ? body.note.trim() : '';

  if (name.length > 150) return { error: 'Nama maksimal 150 karakter.' };
  if (rawPhone.length > 30) return { error: 'Nomor WhatsApp tidak valid.' };
  if (note.length > 2000) return { error: 'Catatan maksimal 2.000 karakter.' };
  if ((name && !rawPhone) || (!name && rawPhone)) {
    return { error: 'Nama pendaftar dan nomor WhatsApp harus diisi bersama.' };
  }

  const phone = rawPhone ? rawPhone.replace(/[^\d+]/g, '') : '';
  if (phone && !/^\+?\d{8,15}$/.test(phone)) {
    return { error: 'Gunakan nomor WhatsApp dengan kode negara, misalnya +6281234567890.' };
  }

  const unitPriceIdr = Number(packageItem.price.replace(/\D/g, ''));
  if (!Number.isSafeInteger(unitPriceIdr) || unitPriceIdr < 1) {
    return { error: 'Harga paket belum dapat diproses.' };
  }

  return {
    value: {
      packageId,
      packageName: packageItem.title,
      departure: packageItem.departure,
      duration: packageItem.duration,
      unitPriceIdr,
      travelers,
      name: name || null,
      phone: phone || null,
      note: note || null
    }
  };
}

function toPublicDraft(row) {
  return {
    id: row.id,
    packageId: String(row.package_id),
    travelers: String(row.travelers),
    name: row.registrant_name ?? '',
    phone: row.phone ?? '',
    note: row.note ?? ''
  };
}

export function createApp({
  pool,
  dokuClient = null,
  paymentConfig = null,
  secureCookies = process.env.NODE_ENV === 'production'
}) {
  if (!pool) throw new Error('A database pool is required to create the registration API.');

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({
    limit: '16kb',
    verify: (request, _response, buffer) => {
      request.rawBody = Buffer.from(buffer);
    }
  }));

  app.get('/api/health', async (_request, response) => {
    await pool.query('SELECT 1');
    response.json({ status: 'ok' });
  });

  app.get('/api/payments/config', (_request, response) => {
    response.json({
      enabled: Boolean(paymentConfig?.enabled && dokuClient),
      dpEnabled: Boolean(paymentConfig?.enabled && dokuClient && paymentConfig.dpEnabled)
    });
  });

  app.get('/api/registrations/draft', async (request, response) => {
    const token = readDraftToken(request);
    if (!token) {
      response.sendStatus(204);
      return;
    }

    const [rows] = await pool.execute(
      `SELECT id, package_id, travelers, registrant_name, phone, note
       FROM registration_drafts
       WHERE access_token_hash = ? AND status = 'draft' AND expires_at > UTC_TIMESTAMP()
       LIMIT 1`,
      [hashToken(token)]
    );

    if (rows.length === 0) {
      clearDraftCookie(response, secureCookies);
      response.sendStatus(204);
      return;
    }

    response.json({ registration: toPublicDraft(rows[0]) });
  });

  app.post('/api/registrations/draft', async (request, response) => {
    const validation = validateDraft(request.body);
    if (validation.error) {
      response.status(400).json({ error: validation.error });
      return;
    }

    const draft = validation.value;
    const token = readDraftToken(request);
    if (token) {
      const tokenHash = hashToken(token);
      const [rows] = await pool.execute(
        `SELECT id
         FROM registration_drafts
         WHERE access_token_hash = ? AND status = 'draft' AND expires_at > UTC_TIMESTAMP()
         LIMIT 1`,
        [tokenHash]
      );

      if (rows.length === 0) {
        clearDraftCookie(response, secureCookies);
        response.status(410).json({ error: 'Masa penyimpanan draft sudah berakhir. Silakan mulai pendaftaran baru.' });
        return;
      }

      const id = rows[0].id;
      const [updateResult] = await pool.execute(
        `UPDATE registration_drafts
         SET package_id = ?, package_name = ?, departure = ?, duration = ?, unit_price_idr = ?,
             travelers = ?, registrant_name = ?, phone = ?, note = ?, updated_at = UTC_TIMESTAMP()
         WHERE id = ? AND access_token_hash = ? AND status = 'draft' AND expires_at > UTC_TIMESTAMP()`,
        [
          draft.packageId,
          draft.packageName,
          draft.departure,
          draft.duration,
          draft.unitPriceIdr,
          draft.travelers,
          draft.name,
          draft.phone,
          draft.note,
          id,
          tokenHash
        ]
      );

      if (updateResult.affectedRows !== 1) {
        clearDraftCookie(response, secureCookies);
        response.status(410).json({ error: 'Masa penyimpanan draft sudah berakhir. Silakan mulai pendaftaran baru.' });
        return;
      }

      response.json({ registration: { id, ...toDraftResponse(draft) } });
      return;
    }

    const newToken = randomBytes(32).toString('base64url');
    const id = randomUUID();
    await pool.execute(
      `INSERT INTO registration_drafts
         (id, access_token_hash, package_id, package_name, departure, duration, unit_price_idr,
          travelers, registrant_name, phone, note, status, created_at, updated_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', UTC_TIMESTAMP(), UTC_TIMESTAMP(),
               DATE_ADD(UTC_TIMESTAMP(), INTERVAL 24 HOUR))`,
      [
        id,
        hashToken(newToken),
        draft.packageId,
        draft.packageName,
        draft.departure,
        draft.duration,
        draft.unitPriceIdr,
        draft.travelers,
        draft.name,
        draft.phone,
        draft.note
      ]
    );

    setDraftCookie(response, newToken, draftLifetimeSeconds, secureCookies);
    response.status(201).json({ registration: { id, ...toDraftResponse(draft) } });
  });

  app.post('/api/registrations/payment', async (request, response) => {
    if (!paymentConfig?.enabled || !dokuClient) {
      response.status(503).json({
        error: 'Pembayaran belum dikonfigurasi.',
        missing: paymentConfig?.missingGateway ?? ['DOKU_CLIENT_ID', 'DOKU_SECRET_KEY', 'PUBLIC_APP_URL']
      });
      return;
    }

    const paymentType = request.body?.paymentType;
    if (paymentType !== 'dp' && paymentType !== 'full') {
      response.status(400).json({ error: 'Pilih pembayaran DP atau lunas.' });
      return;
    }

    const token = readDraftToken(request);
    if (!token) {
      response.status(404).json({ error: 'Draft pendaftaran tidak ditemukan.' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT id, unit_price_idr, travelers, registrant_name, phone
       FROM registration_drafts
       WHERE access_token_hash = ? AND status = 'draft' AND expires_at > UTC_TIMESTAMP()
       LIMIT 1`,
      [hashToken(token)]
    );
    const draft = rows[0];
    if (!draft) {
      response.status(404).json({ error: 'Draft pendaftaran tidak ditemukan atau sudah kedaluwarsa.' });
      return;
    }
    if (!draft.registrant_name || !draft.phone) {
      response.status(400).json({ error: 'Lengkapi nama pendaftar dan nomor WhatsApp sebelum membayar.' });
      return;
    }

    const totalAmount = Number(draft.unit_price_idr) * Number(draft.travelers);
    let amount;
    try {
      amount = calculatePaymentAmount({
        paymentType,
        totalAmount,
        travelers: Number(draft.travelers),
        dpPolicy: paymentConfig.dpPolicy,
        dpValue: paymentConfig.dpValue
      });
    } catch (error) {
      const isUnconfiguredDp = paymentType === 'dp' && !paymentConfig.dpEnabled;
      response.status(isUnconfiguredDp ? 503 : 400).json({
        error: isUnconfiguredDp ? 'Aturan nominal DP belum dikonfigurasi.' : error.message,
        ...(isUnconfiguredDp ? { missing: paymentConfig.missingDp } : {})
      });
      return;
    }

    const [existingRows] = await pool.execute(
      `SELECT invoice_number, amount_idr, payment_url
       FROM registration_payments
       WHERE registration_draft_id = ? AND payment_type = ? AND status = 'pending'
         AND payment_url IS NOT NULL
       ORDER BY created_at DESC
       LIMIT 1`,
      [draft.id, paymentType]
    );
    const existing = existingRows[0];
    if (existing && Number(existing.amount_idr) === amount) {
      response.json({
        payment: {
          invoiceNumber: existing.invoice_number,
          amount,
          status: 'pending',
          paymentUrl: existing.payment_url
        }
      });
      return;
    }

    const paymentId = randomUUID();
    const invoiceNumber = `SAFAR-${Date.now()}-${randomBytes(3).toString('hex')}`;
    await pool.execute(
      `INSERT INTO registration_payments
         (id, registration_draft_id, invoice_number, payment_type, amount_idr, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pending', UTC_TIMESTAMP(), UTC_TIMESTAMP())`,
      [paymentId, draft.id, invoiceNumber, paymentType, amount]
    );

    let checkout;
    try {
      checkout = await dokuClient.createCheckout({
        amount,
        invoiceNumber,
        callbackUrl: paymentConfig.callbackUrl,
        paymentMethodTypes: paymentConfig.paymentMethodTypes ?? dokuBankVaMethods,
        customer: {
          name: draft.registrant_name,
          phone: draft.phone
        }
      });
    } catch (error) {
      await pool.execute(
        `UPDATE registration_payments
         SET status = 'failed', updated_at = UTC_TIMESTAMP()
         WHERE id = ? AND status = 'pending'`,
        [paymentId]
      );
      console.error('Unable to create DOKU checkout:', error);
      response.status(502).json({ error: 'Halaman pembayaran belum dapat dibuat. Silakan coba lagi.' });
      return;
    }

    await pool.execute(
      `UPDATE registration_payments
       SET doku_request_id = ?, payment_url = ?, updated_at = UTC_TIMESTAMP()
       WHERE id = ? AND status = 'pending'`,
      [checkout.requestId, checkout.paymentUrl, paymentId]
    );

    response.status(201).json({
      payment: {
        invoiceNumber,
        amount,
        status: 'pending',
        paymentUrl: checkout.paymentUrl
      }
    });
  });

  app.post(dokuNotificationPath, async (request, response) => {
    if (!paymentConfig?.clientId || !paymentConfig?.secretKey) {
      response.sendStatus(503);
      return;
    }

    const validSignature = verifyDokuNotification({
      headers: request.headers,
      rawBody: request.rawBody,
      secretKey: paymentConfig.secretKey,
      expectedClientId: paymentConfig.clientId,
      requestTarget: dokuNotificationPath
    });
    if (!validSignature) {
      response.status(403).json({ error: 'Signature not valid.' });
      return;
    }

    const notification = request.body;
    if (notification?.transaction?.status !== 'SUCCESS') {
      response.sendStatus(200);
      return;
    }

    const invoiceNumber = notification?.order?.invoice_number;
    const amount = Number(notification?.order?.amount);
    if (typeof invoiceNumber !== 'string' || !Number.isSafeInteger(amount) || amount < 1) {
      response.status(400).json({ error: 'Notifikasi pembayaran tidak valid.' });
      return;
    }

    const [rows] = await pool.execute(
      `SELECT id, amount_idr, status
       FROM registration_payments
       WHERE invoice_number = ?
       LIMIT 1`,
      [invoiceNumber]
    );
    const payment = rows[0];
    if (!payment) {
      response.status(404).json({ error: 'Invoice pembayaran tidak ditemukan.' });
      return;
    }
    if (Number(payment.amount_idr) !== amount) {
      response.status(400).json({ error: 'Nominal notifikasi tidak sesuai dengan invoice.' });
      return;
    }

    if (payment.status === 'pending') {
      await pool.execute(
        `UPDATE registration_payments
         SET status = 'paid', paid_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP()
         WHERE id = ? AND status = 'pending'`,
        [payment.id]
      );
    }
    response.sendStatus(200);
  });

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API route not found' });
  });

  app.use((error, _request, response, _next) => {
    console.error('Registration API request failed:', error);
    if (response.headersSent) return;
    if (error?.type === 'entity.parse.failed') {
      response.status(400).json({ error: 'Request body harus berupa JSON yang valid.' });
      return;
    }
    if (error?.type === 'entity.too.large') {
      response.status(413).json({ error: 'Ukuran request terlalu besar.' });
      return;
    }
    response.status(500).json({ error: 'Terjadi kesalahan server. Silakan coba lagi.' });
  });

  return app;
}

function toDraftResponse(draft) {
  return {
    packageId: String(draft.packageId),
    travelers: String(draft.travelers),
    name: draft.name ?? '',
    phone: draft.phone ?? '',
    note: draft.note ?? ''
  };
}
