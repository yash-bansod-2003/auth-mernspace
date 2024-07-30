import fs from "node:fs";
import path from "node:path";
import rsaPemToJwk from "rsa-pem-to-jwk";

const publicKeyPath = path.resolve("./certs/public.pem");

try {
  const publicKey = fs.readFileSync(publicKeyPath, "utf8");
  const jwk = rsaPemToJwk(publicKey, { use: "sig" }, "public");
  console.log(JSON.stringify(jwk));
} catch (error) {
  console.error("Error:", error.message);
}