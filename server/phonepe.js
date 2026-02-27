import crypto from 'crypto'

function mustEnv(name) {
  const v = process.env[name]
  if (!v) throw new Error(`${name} is not set`)
  return v
}

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function checksumFor({ base64Payload, apiPath, saltKey, saltIndex }) {
  const toHash = `${base64Payload}${apiPath}${saltKey}`
  const digest = sha256Hex(toHash)
  return `${digest}###${saltIndex}`
}

function checksumForStatus({ apiPath, saltKey, saltIndex }) {
  // Status API checksum does not use payload; it hashes: apiPath + saltKey
  const digest = sha256Hex(`${apiPath}${saltKey}`)
  return `${digest}###${saltIndex}`
}

export function isPhonePeConfigured() {
  return Boolean(
    process.env.PHONEPE_MERCHANT_ID &&
      process.env.PHONEPE_SALT_KEY &&
      process.env.PHONEPE_SALT_INDEX &&
      process.env.PHONEPE_HOST_URL &&
      process.env.BACKEND_URL
  )
}

export async function createPhonePePayPage({
  orderId,
  amountInr,
  customerPhone,
  customerEmail,
}) {
  const merchantId = mustEnv('PHONEPE_MERCHANT_ID')
  const saltKey = mustEnv('PHONEPE_SALT_KEY')
  const saltIndex = mustEnv('PHONEPE_SALT_INDEX')
  const hostUrl = mustEnv('PHONEPE_HOST_URL').replace(/\/$/, '')
  const backendUrl = mustEnv('BACKEND_URL').replace(/\/$/, '')

  const merchantTransactionId = `SX_${orderId}_${Date.now()}`
  const apiPath = '/pg/v1/pay'

  const payload = {
    merchantId,
    merchantTransactionId,
    merchantUserId: orderId,
    amount: Math.round(Number(amountInr) * 100), // paise
    redirectUrl: `${backendUrl}/api/payments/phonepe/callback`,
    redirectMode: 'REDIRECT',
    callbackUrl: `${backendUrl}/api/payments/phonepe/callback`,
    mobileNumber: customerPhone || undefined,
    email: customerEmail || undefined,
    paymentInstrument: { type: 'PAY_PAGE' },
  }

  const base64Payload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64')
  const xVerify = checksumFor({ base64Payload, apiPath, saltKey, saltIndex })

  const res = await fetch(`${hostUrl}${apiPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
    },
    body: JSON.stringify({ request: base64Payload }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `PhonePe pay failed (${res.status})`)
  }

  const redirectUrl =
    data?.data?.instrumentResponse?.redirectInfo?.url ||
    data?.data?.instrumentResponse?.redirectInfo?.redirectUrl ||
    data?.data?.instrumentResponse?.redirectInfo?.redirectURI

  if (!redirectUrl) {
    throw new Error('PhonePe did not return a redirect URL')
  }

  return { merchantTransactionId, paymentUrl: redirectUrl, raw: data }
}

export async function getPhonePeStatus({ merchantTransactionId }) {
  const merchantId = mustEnv('PHONEPE_MERCHANT_ID')
  const saltKey = mustEnv('PHONEPE_SALT_KEY')
  const saltIndex = mustEnv('PHONEPE_SALT_INDEX')
  const hostUrl = mustEnv('PHONEPE_HOST_URL').replace(/\/$/, '')

  const apiPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`
  const xVerify = checksumForStatus({ apiPath, saltKey, saltIndex })

  const res = await fetch(`${hostUrl}${apiPath}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-MERCHANT-ID': merchantId,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `PhonePe status failed (${res.status})`)
  }
  return data
}

export function isPhonePePaymentSuccess(statusResponse) {
  const code = statusResponse?.code || statusResponse?.data?.code
  const state = statusResponse?.data?.state
  const success = statusResponse?.success

  // Be tolerant across versions:
  // - code: PAYMENT_SUCCESS / PAYMENT_PENDING / PAYMENT_ERROR
  // - state: COMPLETED / PENDING / FAILED
  if (code === 'PAYMENT_SUCCESS') return true
  if (state === 'COMPLETED') return true
  if (success === true && state === 'COMPLETED') return true
  return false
}

