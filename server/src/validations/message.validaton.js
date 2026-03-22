import { z } from "zod";

const objectId = (fieldName) =>
  z.string().regex(/^[a-f\d]{24}$/i, `Invalid ${fieldName}`);

export const getOrCreateConversationSchema = z
  .object({
    campaignId: objectId("campaignId"),
    volunteerId: objectId("volunteerId").optional().nullable(),
  })
  .strict();