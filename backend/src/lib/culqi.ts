export interface CulqiChargeParams {
  amount: number // in centavos (PEN) — e.g. 2500 = S/. 25.00
  currency: string
  email: string
  sourceId: string
  description: string
  orderId: string
}

export async function createCharge(params: CulqiChargeParams) {
  const secretKey = process.env.CULQI_SECRET_KEY
  if (!secretKey || secretKey === 'sk_test_placeholder') {
    // Mock response for dev without real Culqi keys
    return { id: `mock_charge_${Date.now()}`, object: 'charge', amount: params.amount }
  }

  const res = await fetch('https://api.culqi.com/v2/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency_code: params.currency,
      email: params.email,
      source_id: params.sourceId,
      description: params.description,
      metadata: { order_id: params.orderId },
    }),
  })

  const data = await res.json() as { id?: string; user_message?: string; object?: string; amount?: number }
  if (!res.ok) {
    throw new Error(data.user_message || 'Error al procesar el pago')
  }
  return data
}
