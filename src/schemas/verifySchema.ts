import { z } from "zod";
// verifySchema validation
export const verifySchema = z.object({
  code: z
    .string()
    .length(6, { message: "Verification code must be of 6 digits" }),
});
