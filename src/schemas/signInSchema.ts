import { z } from "zod";
// signInSchema validation
export const signInSchema = z.object({
  identifier:z.string(),
  password:z.string()
});
