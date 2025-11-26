import { z } from "zod";

export const dataRecordSchema = z.object({
  id: z.string(),
  end_year: z.union([z.number(), z.string()]).optional(),
  intensity: z.number().optional(),
  sector: z.string().optional(),
  topic: z.string().optional(),
  insight: z.string().optional(),
  url: z.string().optional(),
  region: z.string().optional(),
  start_year: z.union([z.number(), z.string()]).optional(),
  impact: z.union([z.number(), z.string()]).optional(),
  added: z.string().optional(),
  published: z.string().optional(),
  country: z.string().optional(),
  relevance: z.number().optional(),
  pestle: z.string().optional(),
  source: z.string().optional(),
  title: z.string().optional(),
  likelihood: z.number().optional(),
  city: z.string().optional(),
  swot: z.string().optional(),
});

export type DataRecord = z.infer<typeof dataRecordSchema>;

export const filtersSchema = z.object({
  end_year: z.array(z.union([z.number(), z.string()])),
  topic: z.array(z.string()),
  sector: z.array(z.string()),
  region: z.array(z.string()),
  pestle: z.array(z.string()),
  source: z.array(z.string()),
  swot: z.array(z.string()),
  country: z.array(z.string()),
  city: z.array(z.string()),
});

export type Filters = z.infer<typeof filtersSchema>;

export const filterQuerySchema = z.object({
  end_year: z.string().optional(),
  topic: z.string().optional(),
  sector: z.string().optional(),
  region: z.string().optional(),
  pestle: z.string().optional(),
  source: z.string().optional(),
  swot: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
});

export type FilterQuery = z.infer<typeof filterQuerySchema>;

export const users = undefined;
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
