import { z } from "zod";

export const ZBook = z.object({
	title: z.string(),
	author: z.string(),
	genre: z.string(),
	isbn: z.string(),
	description: z.string(),
	copies: z.number(),
	available: z.boolean().optional(),
});
