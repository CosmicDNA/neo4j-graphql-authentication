import { jwtDecrypt } from "jose"
import hkdf from "@panva/hkdf"

const getDerivedEncryptionKey = async (keyMaterial, salt) => {
  return await hkdf(
    "sha256",
    keyMaterial,
    salt,
    `NextAuth.js Generated Encryption Key${salt ? ` (${salt})` : ""}`,
    32
  )
}

const decryptToken = async (token, secret) => {
  const encryptionKey = await getDerivedEncryptionKey(secret, "")
  const { payload } = await jwtDecrypt(token, encryptionKey)
  return payload
}

const result = await decryptToken(process.env.NEXTAUTH_JWT_TOKEN, process.env.AUTH_SECRET)
console.log(result)