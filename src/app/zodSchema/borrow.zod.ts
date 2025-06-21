import { z } from "zod";

export const ZBorrow = z.object({
	book: z.string(),
	quantity: z.number(),
	dueDate: z.string()
});
