import crypto from "crypto";

// Decode base32 keys into hex buffers
function base32ToHex(base32) {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";
  
  const cleanBase32 = base32.replace(/=+$/, "").toUpperCase();
  
  for (let i = 0; i < cleanBase32.length; i++) {
    const val = base32chars.indexOf(cleanBase32.charAt(i));
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  
  for (let i = 0; i + 4 <= bits.length; i += 4) {
    const chunk = bits.substring(i, i + 4);
    hex += parseInt(chunk, 2).toString(16);
  }
  
  return hex;
}

// Generate the TOTP code for a specific timestamp window
export function generateTOTP(secret, windowOffset = 0) {
  const keyHex = base32ToHex(secret);
  const epoch = Math.round(new Date().getTime() / 1000.0);
  const timeWindow = Math.floor(epoch / 30) + windowOffset;
  const timeHex = timeWindow.toString(16).padStart(16, '0');
  
  const hmac = crypto.createHmac("sha1", Buffer.from(keyHex, "hex"));
  hmac.update(Buffer.from(timeHex, "hex"));
  const hmacResult = hmac.digest();
  
  const offset = hmacResult[hmacResult.length - 1] & 0xf;
  const code = ((hmacResult[offset] & 0x7f) << 24) |
               ((hmacResult[offset + 1] & 0xff) << 16) |
               ((hmacResult[offset + 2] & 0xff) << 8) |
               (hmacResult[offset + 3] & 0xff);
               
  return (code % 1000000).toString().padStart(6, '0');
}

// Validate code against secret, allowing clock drift
export function verifyTOTP(token, secret) {
  if (!token || !secret) return false;
  
  // Allow the current window, one step back, and one step forward
  for (let i = -1; i <= 1; i++) {
    if (generateTOTP(secret, i) === token.trim()) {
      return true;
    }
  }
  return false;
}
