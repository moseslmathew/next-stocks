import { z } from "zod";

export const stockSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  lastUpdated: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const stocksSchema = z.array(stockSchema);

export type StockType = z.infer<typeof stockSchema>;
