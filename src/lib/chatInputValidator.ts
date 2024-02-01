import { z } from "zod";

export const chatInputValidator = z.object({
  message: z.string(),
  fileId: z.string(),
});
