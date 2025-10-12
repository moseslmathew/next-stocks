import { z } from "zod";

export const stockSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  currentPrice: z.coerce.number().nullable().optional(),
  previousClose: z.coerce.number().nullable().optional(),
  dayHigh: z.coerce.number().nullable().optional(),
  dayLow: z.coerce.number().nullable().optional(),
  volume: z.coerce
    .bigint()
    .nullable()
    .optional()
    .transform((v) => v?.toString()),
  lastUpdated: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const stocksSchema = z.array(stockSchema);

export type StockType = z.infer<typeof stockSchema>;
