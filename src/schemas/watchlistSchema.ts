import { z } from "zod";
import { stockSchema } from "./stockSchema";

export const watchlistItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  stockId: z.string(),
  targetPrice: z.coerce.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  addedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  stock: stockSchema.optional(), // included when querying with `include: { stock: true }`
});

export const watchlistSchema = z.array(watchlistItemSchema);

export type WatchlistItemType = z.infer<typeof watchlistItemSchema>;
