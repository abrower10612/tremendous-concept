// Money helpers. The backend stores integer cents; the UI works in dollars.

export function dollarsToCents(input: string | number): number {
  const n = typeof input === 'number' ? input : parseFloat(input)
  if (Number.isNaN(n)) return 0
  return Math.round(n * 100)
}

export function formatCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}
