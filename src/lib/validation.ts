import { z } from "zod";

export const idParamSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9]+$/, "Invalid id format"),
});
