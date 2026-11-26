const dpPolicies = new Set(['percentage', 'fixed_per_traveler']);

export const dokuBankVaMethods = Object.freeze([
  'VIRTUAL_ACCOUNT_BCA',
  'VIRTUAL_ACCOUNT_BANK_MANDIRI',
  'VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI',
  'VIRTUAL_ACCOUNT_BRI',
  'VIRTUAL_ACCOUNT_BNI',
  'VIRTUAL_ACCOUNT_BANK_PERMATA',
  'VIRTUAL_ACCOUNT_BANK_CIMB',
  'VIRTUAL_ACCOUNT_BANK_DANAMON',
  'VIRTUAL_ACCOUNT_BTN',
  'VIRTUAL_ACCOUNT_BNC',
  'VIRTUAL_ACCOUNT_BSS',
  'VIRTUAL_ACCOUNT_BJB',
  'VIRTUAL_ACCOUNT_Sinarmas'
]);

const dokuBankVaMethodSet = new Set(dokuBankVaMethods);

export function loadPaymentConfig(env) {
  const missingGateway = [];
  const missingDp = [];
  const clientId = env.DOKU_CLIENT_ID?.trim() ?? '';
  const secretKey = env.DOKU_SECRET_KEY?.trim() ?? '';
  const publicAppUrl = env.PUBLIC_APP_URL?.trim() ?? '';
  const policy = env.PAYMENT_DP_POLICY?.trim() ?? '';
  const rawValue = env.PAYMENT_DP_VALUE?.trim() ?? '';
  const mode = env.DOKU_MODE?.trim() || 'sandbox';
  const rawMethods = env.DOKU_PAYMENT_METHOD_TYPES?.trim() ?? '';
  const paymentMethodTypes = rawMethods
    ? [...new Set(rawMethods.split(',').map(method => method.trim()).filter(Boolean))]
    : [...dokuBankVaMethods];

  if (!clientId) missingGateway.push('DOKU_CLIENT_ID');
  if (!secretKey) missingGateway.push('DOKU_SECRET_KEY');
  if (!publicAppUrl) missingGateway.push('PUBLIC_APP_URL');
  if (!policy) missingDp.push('PAYMENT_DP_POLICY');
  if (!rawValue) missingDp.push('PAYMENT_DP_VALUE');

  if (!['sandbox', 'production'].includes(mode)) {
    throw new Error('DOKU_MODE must be either "sandbox" or "production".');
  }
  if (policy && !dpPolicies.has(policy)) {
    throw new Error('PAYMENT_DP_POLICY must be "percentage" or "fixed_per_traveler".');
  }
  if (
    paymentMethodTypes.length === 0 ||
    paymentMethodTypes.some(method => !dokuBankVaMethodSet.has(method))
  ) {
    throw new Error('DOKU_PAYMENT_METHOD_TYPES may contain only supported bank Virtual Account methods.');
  }

  let dpValue = null;
  if (rawValue) {
    dpValue = Number(rawValue);
    if (!Number.isSafeInteger(dpValue) || dpValue < 1) {
      throw new Error('PAYMENT_DP_VALUE must be a positive whole number.');
    }
    if (policy === 'percentage' && dpValue >= 100) {
      throw new Error('PAYMENT_DP_VALUE must be below 100 for a percentage DP policy.');
    }
  }

  let callbackUrl = null;
  if (publicAppUrl) {
    try {
      const url = new URL(publicAppUrl);
      if (
        url.protocol !== 'https:' ||
        url.pathname !== '/' ||
        url.search ||
        url.hash ||
        url.username ||
        url.password
      ) throw new Error();
      callbackUrl = new URL('/daftar?payment=return', url).toString();
    } catch {
      missingGateway.push('PUBLIC_APP_URL');
    }
  }

  return {
    enabled: missingGateway.length === 0,
    missingGateway,
    dpEnabled: missingDp.length === 0,
    missingDp,
    clientId,
    secretKey,
    mode,
    callbackUrl,
    dpPolicy: policy || null,
    dpValue,
    paymentMethodTypes
  };
}

export function calculatePaymentAmount({ paymentType, totalAmount, travelers, dpPolicy, dpValue }) {
  if (!Number.isSafeInteger(totalAmount) || totalAmount < 1 || totalAmount > 999_999_999_999) {
    throw new Error('The registration total must be a positive whole number.');
  }
  if (!Number.isSafeInteger(travelers) || travelers < 1) {
    throw new Error('The traveler count must be a positive whole number.');
  }
  if (paymentType === 'full') return totalAmount;
  if (paymentType !== 'dp') throw new Error('Choose either a DP or full payment.');
  if (!dpPolicy || !Number.isSafeInteger(dpValue) || dpValue < 1) {
    throw new Error('DP payment has not been configured.');
  }

  const amount = dpPolicy === 'percentage'
    ? Math.round(totalAmount * dpValue / 100)
    : dpValue * travelers;
  if (!Number.isSafeInteger(amount) || amount < 1 || amount >= totalAmount) {
    throw new Error('The configured DP amount must be greater than zero and less than the package total.');
  }
  return amount;
}
