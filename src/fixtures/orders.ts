/**
 * DEVELOPMENT FIXTURE — NOT VERIFIED PRODUCT DATA.
 *
 * Historical orders for the approved fixture buyer, so order history and reorder can be
 * exercised. Statuses are drawn from designed states only — no invented fulfilment stage.
 */

import { usd } from '@/domain/money'
import type { Order } from '@/domain/order'

export const ORDER_RECORDS: readonly Order[] = [
  {
    id: 'LB-2026-0641',
    buyerId: 'b-approved',
    status: 'delivered',
    createdAt: '2026-05-04',
    submittedAt: '2026-05-04',
    shipWindow: { start: '2026-05-11', end: '2026-05-15' },
    tracking: 'FIXTURE-TRACKING-0641',
    lines: [
      {
        id: 'l-0641-1',
        productId: 'p-je322-dw',
        productSlug: 'dark-wash-bootcut-jean',
        productName: 'Dark Wash Bootcut',
        sku: 'JE322-DW',
        prepack: {
          totalUnits: 6,
          breakdown: [
            { size: 'S', quantity: 1 },
            { size: 'M', quantity: 2 },
            { size: 'L', quantity: 2 },
            { size: 'XL', quantity: 1 },
          ],
          openSizing: false,
        },
        quantity: 3,
        unitPrice: usd(3000),
      },
      {
        id: 'l-0641-2',
        productId: 'p-yee-haw-tee',
        productSlug: 'yee-haw-motif-short-sleeve-tee',
        productName: 'Yee Haw Tee',
        sku: 'LB-YHT-BLK',
        prepack: {
          totalUnits: 6,
          breakdown: [
            { size: '7', quantity: 1 },
            { size: '8', quantity: 1 },
            { size: '10', quantity: 2 },
            { size: '12', quantity: 1 },
            { size: '14', quantity: 1 },
          ],
          openSizing: false,
        },
        quantity: 2,
        unitPrice: usd(700),
      },
    ],
  },
  {
    id: 'LB-2026-0788',
    buyerId: 'b-approved',
    status: 'in-production',
    createdAt: '2026-07-19',
    submittedAt: '2026-07-19',
    shipWindow: { start: '2026-08-10', end: '2026-08-21' },
    lines: [
      {
        id: 'l-0788-1',
        productId: 'p-je334-dw',
        productSlug: 'dark-wash-high-rise-flare-jean',
        productName: 'Dark Wash Flare',
        sku: 'JE334-DW',
        prepack: {
          totalUnits: 6,
          breakdown: [
            { size: 'S', quantity: 1 },
            { size: 'M', quantity: 2 },
            { size: 'L', quantity: 2 },
            { size: 'XL', quantity: 1 },
          ],
          openSizing: false,
        },
        quantity: 4,
        unitPrice: usd(3100),
      },
    ],
  },
] as const
