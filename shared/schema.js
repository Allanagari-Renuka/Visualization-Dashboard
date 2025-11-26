// shared/schema.js
// Note: Zod schemas removed for JS; types exported as comments or objects if needed
// export const dataRecordSchema = ... (Zod object removed)
// export type DataRecord = ... (use as comment)

export const users = undefined;
export const insertUserSchema = {
  username: "string",
  password: "string",
};
// export type InsertUser = ... (comment)
// export type User = { id: string; username: string; password: string };