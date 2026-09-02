/**
 * One-time script: sets the `admin: true` custom claim on your Firebase Auth
 * account, so Firestore/Storage rules can check `request.auth.token.admin`
 * instead of hardcoding your email.
 *
 * Setup:
 *   1. Firebase Console -> Project Settings -> Service Accounts
 *      -> "Generate new private key" -> save the JSON somewhere OUTSIDE
 *      this repo (or as serviceAccountKey.json here, which is gitignored).
 *   2. npm install firebase-admin --no-save   (one-time, not kept in package.json)
 *   3. node scripts/set-admin-claim.mjs "path/to/serviceAccountKey.json" your-email@gmail.com
 *
 * After running, sign the account out and back in (or refresh its ID token)
 * so the new claim takes effect, then verify /admin still works before
 * deploying the updated rules.
 */
import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [, , keyPath, email] = process.argv;

if (!keyPath || !email) {
  console.error("Usage: node scripts/set-admin-claim.mjs <serviceAccountKey.json> <admin-email>");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { admin: true });

console.log(`Set { admin: true } on ${email} (uid: ${user.uid}).`);
console.log("Sign this account out and back in for the claim to apply, then verify /admin still logs in before deploying the new rules.");
