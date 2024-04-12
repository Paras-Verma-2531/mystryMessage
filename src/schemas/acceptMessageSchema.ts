import { z } from "zod";
// acceptMessageSchema validation
export const acceptMessageSchema = z.object({
  acceptMessages:z.boolean()
});
