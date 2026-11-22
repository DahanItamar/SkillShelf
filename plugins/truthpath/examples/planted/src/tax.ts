export interface Order { subtotalCents: number; region: string }

// TODO: look up real regional rates
export function taxFor(order: Order): number {
  return 0;
}
