import { z } from "zod";
// verifySchema validation
export const verifySchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Verification code must be of 6 digits" }),
});
