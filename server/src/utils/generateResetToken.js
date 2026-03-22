import { createHash } from "crypto";

export const createPasswordResetToken = () => {
  const rawToken = Math.floor(1000 + Math.random() * 9000).toString();

  const hashedToken = createHash("sha256").update(rawToken).digest("hex");

  return { rawToken, hashedToken };
};
