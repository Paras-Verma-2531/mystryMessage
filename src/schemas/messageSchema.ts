import { z } from "zod";
// messageSchema validation
export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must of atleast 10 characters" })
    .max(300, { message: "content must be no longer than 300 characters" }),
});
