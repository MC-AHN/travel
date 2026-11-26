import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mysql from 'mysql2/promise';
import { createApp } from './app.js';
import { loadPaymentConfig } from './payments/config.js';
import { createDokuCheckoutClient } from './payments/doku.js';

const port = Number(process.env.PORT || 3001);
const requiredEnvironment = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingEnvironment = requiredEnvironment.filter(name => !process.env[name]);

if (missingEnvironment.length > 0) {
  throw new Error(`Missing required database configuration: ${missingEnvironment.join(', ')}`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 20,
  timezone: 'Z'
});

const paymentConfig = loadPaymentConfig(process.env);
const dokuClient = paymentConfig.enabled
  ? createDokuCheckoutClient({
      clientId: paymentConfig.clientId,
      secretKey: paymentConfig.secretKey,
      mode: paymentConfig.mode
    })
  : null;
if (!paymentConfig.enabled) {
  console.warn(`DOKU payments are disabled; missing configuration: ${paymentConfig.missingGateway.join(', ')}`);
}

const app = createApp({ pool, dokuClient, paymentConfig });
if (process.env.NODE_ENV === 'production') {
  const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
  app.use(express.static(distDirectory, { index: false }));
  app.get(/^\/(?!api(?:\/|$)).*/, (_request, response, next) => {
    response.sendFile(path.join(distDirectory, 'index.html'), error => {
      if (error) next(error);
    });
  });
}

try {
  await pool.query('SELECT 1');
} catch (error) {
  console.error('Unable to connect to the configured MySQL database:', error);
  await pool.end();
  process.exitCode = 1;
}

if (process.exitCode !== 1) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`API server listening on port ${port}`);
  });
}
