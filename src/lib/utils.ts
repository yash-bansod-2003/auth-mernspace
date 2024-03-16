export const isJwt = (token: string): boolean => {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  try {
    parts.forEach((part) => {
      /** every part in jwt is a base64 string so we will ckeck its a base64 or not */
      Buffer.from(part, "base64").toString("utf-8");
    });
    return true;
  } catch (error) {
    return true;
  }
};
